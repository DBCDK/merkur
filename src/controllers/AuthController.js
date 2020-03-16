/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import AgencyIdConverter from "../model/AgencyIdConverter";
import {HttpClient} from "../HttpClient";
import logger from '../Logger';
import constants from "../constants";
import queryString from "query-string";

const BIB_DK_AUTHENTICATION_URL = process.env.BIB_DK_AUTHENTICATION_URL
    || "bib-dk-authentication-url-not-set";
const BIB_DK_TOKEN_REQUEST_URL = process.env.BIB_DK_TOKEN_REQUEST_URL
    || "bib-dk-token-request-url-not-set";
const BIB_DK_USERINFO_URL = process.env.BIB_DK_USERINFO_URL
    || "bib-dk-userinfo-url-not-set";
const BIB_DK_CLIENT_ID = process.env.BIB_DK_CLIENT_ID
    || "bib-dk-client-id-not-set";
const BIB_DK_CLIENT_SECRET = process.env.BIB_DK_CLIENT_SECRET
    || "bib-dk-client-secret-not-set";
const SESSION_SECRET = process.env.SESSION_SECRET
    || "";  // Empty default produces a warning in the server log
const APIKEYS = JSON.parse(process.env.APIKEYS);
const BIB_DK_REDIRECT_URL = process.env.BIB_DK_REDIRECT_URL
    || "bib-dk-redirect-url-not-set";
const BIB_DK_LOGOUT_URL = process.env.BIB_DK_LOGOUT_URL
    || "bib-dk-logout-url-not-set";

const auth_session = {
    name: 'merkur_session',
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 86400000,
        httpOnly: true
    }
};

const login = (req, res) => {
    if (req.session.agencyid) {
        logger.debug(`reading agency ID ${req.session.agencyid} from session`,
            {logger: `${__filename}#login`});

        // Return agencyid from cookie
        res.status(200).send(req.session.agencyid);

    } else if ( req.query.code !== undefined ) {
        logger.debug("Received authorization code " + req.query.code,
            {logger: `${__filename}#login`});

        // Request authorization token
        let q = "grant_type=authorization_code" +
            "&code=" + req.query.code +
            "&redirect_uri=" + BIB_DK_REDIRECT_URL +
            "&client_id=" + BIB_DK_CLIENT_ID +
            "&client_secret=" + BIB_DK_CLIENT_SECRET;
        new HttpClient()
            .addHeaders({"Content-type": "application/x-www-form-urlencoded"})
            .post(BIB_DK_TOKEN_REQUEST_URL, null, null, q)
            .end()
            .then(response => {
                let token = response.body.access_token;

                // Retrieve agencyid
                new HttpClient()
                    .addHeaders({"Content-type": "application/x-www-form-urlencoded", "Authorization": "Bearer " + token})
                    .post(BIB_DK_USERINFO_URL, null, null)
                    .end()
                    .then(response => {
                        req.session.agencyid = response.body.attributes.netpunktAgency;
                        req.session.token = token;
                        res.status(200).send(req.session.agencyid);
                    })
                    .catch(err => {
                        logger.error("Userinfo request failed: " + err);
                        res.status(500).send(-1);
                        return;
                    });
            })
            .catch(err => {
                logger.error("Authentication token request failed: " + err.response.text);
                res.status(500).send("-1");
                return;
            });

    }
    else {
        logger.debug("No agencyid or code, redirect to " + BIB_DK_AUTHENTICATION_URL,
            {logger: `${__filename}#login`});

        // Redirect to the login page on login.bib.dk
        let q = BIB_DK_AUTHENTICATION_URL +
            "?response_type=code" +
            "&client_id=" + BIB_DK_CLIENT_ID +
            "&redirect_uri=" + BIB_DK_REDIRECT_URL +
            "&agencyType=forsk,folk";
        res.status(403).send(q);
    }
};

const authenticate = (request, response) => {
    if (request.session.agencyid) {
        logger.debug(`authenticating via session`,
            {logger: `${__filename}#authenticate`});
        return request.session.agencyid;
    }
    logger.debug(`authenticating via authorization header`,
        {logger: `${__filename}#authenticate`});

    if (!request.headers.authorization) {
        response.setHeader('WWW-Authenticate', 'Basic realm="DBC merkur"');
        response.status(401).send("Missing Authorization header");
        return undefined;
    }

    let parts = request.headers.authorization.split(' ');
    if (parts.length !== 2) {
        response.setHeader('WWW-Authenticate', 'Basic realm="DBC merkur"');
        response.status(401).send("Authorization header must include both type and credentials");
        return undefined;
    }

    // verify type
    if (parts[0].toLowerCase() !== 'basic') {
        response.setHeader('WWW-Authenticate', 'Basic realm="DBC merkur"');
        response.status(401).send("Authorization type must be Basic");
        return undefined;
    }

    const encodedCredentials = parts[1];
    const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf8');

    parts = decodedCredentials.split(':');
    if (parts.length !== 2) {
        response.setHeader('WWW-Authenticate', 'Basic realm="DBC merkur"');
        response.status(401).send("Apikey must include both user and secret");
        return undefined;
    }

    if (APIKEYS[parts[0]] && APIKEYS[parts[0]]['apikey'] === parts[1]) {
        return parts[0];
    }

    response.setHeader('WWW-Authenticate', 'Basic realm="DBC merkur"');
    response.status(401).send("Unknown agency ID or apikey");
    return undefined;
};

const logout = (req, res) => {
    let q = BIB_DK_LOGOUT_URL + "?access_token=" + req.session.token + "&redirect_uri=" + BIB_DK_REDIRECT_URL;
    req.session.token = undefined;
    req.session.agencyid = undefined;
    res.status(301).header("Location", q).send("Logout");
}

export {auth_session, authenticate, login, logout}
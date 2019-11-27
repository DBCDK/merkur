/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import AgencyIdConverter from "../model/AgencyIdConverter";
import {HttpClient} from "../HttpClient";
import logger from '../Logger';

const NETPUNKT_AUTHENTICATION_URL = process.env.NETPUNKT_AUTHENTICATION_URL
    || "netpunkt-authentication-url-not-set";
const NETPUNKT_REDIRECT_URL = process.env.NETPUNKT_REDIRECT_URL
    || "netpunkt-redirect-url-not-set";
const SESSION_SECRET = process.env.SESSION_SECRET
    || "";  // Empty default produces a warning in the server log
const APIKEYS = JSON.parse(process.env.APIKEYS);

const auth_session = {
    name: 'netpunkt-auth',
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 86400000,
        httpOnly: true
    }
};

const verifyHash = (hash) => {
    return new Promise((resolve, reject) => {
        new HttpClient()
            .addHeaders({"Content-type": "application/x-www-form-urlencoded"})
            .post(NETPUNKT_AUTHENTICATION_URL, null, null, `hash=${hash}`)
            .end()
            .then(response => {
                if (response.header !== undefined && response.header !== null) {
                    if (response.header.agency === undefined) {
                        reject("missing agency header in netpunkt response");
                    }
                    resolve(response.header.agency);
                }
            })
            .catch(err => reject(err));
    });
};

const login = (req, res) => {
    if (req.session.agencyid) {
        logger.debug(`reading agency ID ${req.session.agencyid} from session`,
            {logger: `${__filename}#login`});
        res.status(200).send(req.session.agencyid);
    } else {
        const hash = req.query.hash;
        verifyHash(hash).then(response => {
            logger.debug(`verifying hash ${hash}`,
                {logger: `${__filename}#login`});
            const agencyid = AgencyIdConverter.agencyIdToString(response);
            req.session.agencyid = agencyid;
            logger.debug(`got agency ID ${agencyid} from netpunkt`,
                {logger: `${__filename}#login`});
            res.status(200).send(String(agencyid));
        }).catch(err => {
            if (err.response === undefined) {
                logger.error(`failed to get response from authentication service: ${err}`,
                    {logger: `${__filename}#login`});
            } else {
                if (err.response.status === 501) {
                    logger.debug(`client must redirect to login server ${NETPUNKT_REDIRECT_URL}`,
                        {logger: `${__filename}#login`});
                    res.status(401).send(NETPUNKT_REDIRECT_URL);
                } else {
                    res.status(500).send(err);
                }
            }
        });
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
    const decodedCredentials = new Buffer(encodedCredentials, 'base64').toString('utf8');

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

export {auth_session, authenticate, login}
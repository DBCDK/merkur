/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import AgencyIdConverter from "../model/AgencyIdConverter";
import {HttpClient} from "../HttpClient";

const NETPUNKT_AUTHENTICATION_URL = process.env.NETPUNKT_AUTHENTICATION_URL
    || "netpunkt-authentication-url-not-set";
const NETPUNKT_REDIRECT_URL = process.env.NETPUNKT_REDIRECT_URL
    || "netpunkt-redirect-url-not-set";
const SESSION_SECRET = process.env.SESSION_SECRET
    || "";  // Empty default produces a warning in the server log

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
        console.log("Agency ID from session: " + req.session.agencyid);
        res.status(200).send(req.session.agencyid);
    } else {
        const hash = req.query.hash;
        verifyHash(hash).then(response => {
            console.log("Verifying hash: " + hash);
            const agencyid = AgencyIdConverter.agencyIdToString(response);
            req.session.agencyid = agencyid;
            console.log("Agency ID from netpunkt: " + agencyid);
            res.status(200).send(String(agencyid));
        }).catch(err => {
            if (err.response.status === 501) {
                console.log("Client must redirect to login server: " + NETPUNKT_REDIRECT_URL);
                res.status(401).send(NETPUNKT_REDIRECT_URL);
            } else {
                res.status(500).send(err);
            }
        });
    }
};

const authenticate = (request, response) => {
    if (request.session.agencyid) {
        return request.session.agencyid;
    }

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

    // ToDo: verify secret parts[1]

    return parts[0];
};

export {auth_session, authenticate, login}
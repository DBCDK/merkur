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

// ToDo: get secret from environment variable
// ToDo: replace default memory store not suitable for production environments

const auth_session = {
    name: 'netpunkt-auth',
    secret: 'merkur-secret',
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
        console.log("Reading agency ID from session");
        const agencyid = AgencyIdConverter.agencyIdFromString(
                req.session.agencyid);
        console.log("Agency ID from session: " + agencyid);
        res.status(200).send(String(agencyid));
    } else {
        const hash = req.query.hash;
        verifyHash(hash).then(response => {
            console.log("Verifying hash: " + hash);
            const agencyid = AgencyIdConverter.agencyIdFromString(response);
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

export {auth_session, login}
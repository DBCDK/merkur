/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import constants from "../constants";
import {HttpClient} from "../HttpClient";

class LoginAuthorizer {
    static authorizeHash(hash) {
        const client = new HttpClient();
        return new Promise((resolve, reject) => {
            client.post(constants.authorizeHash, null, null, {hash}).end()
                .then(({text}) => {
                    const json = JSON.parse(text);
                    if(json.hasOwnProperty("agency")) {
                        resolve(json.agency);
                    } else if(json.hasOwnProperty("error")) {
                        reject(json.error);
                    } else {
                        reject("unknown error");
                    }
                })
                .catch(err => reject(err));
        });
    }
}

export default LoginAuthorizer;

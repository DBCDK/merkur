/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import constants from "../constants";
import {HttpClient} from "../HttpClient";

class RedirectUrlHandler {
    static getRedirectUrl() {
        const client = new HttpClient();
        return client.get(constants.getRedirectUrl).end();
    }
}

export default RedirectUrlHandler;

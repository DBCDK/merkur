/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import {HttpClient} from "./HttpClient.js";

const FILESTORE_URL = process.env.FILESTORE_URL || "filestore-url-not-set";
const NETPUNKT_AUTHENTICATION_URL = process.env.NETPUNKT_AUTHENTICATION_URL
    || "netpunkt-authentication-url-not-set";

const FILE = "files/:id";
const FILE_ATTRIBUTES = "files/:id/attributes";
const FILES_COLLECTION = "files";

class StoresConnector {
    static authorizeHash(hash) {
        return new HttpClient()
            .addHeaders({"Content-type": "application/x-www-form-urlencoded"})
            .post(NETPUNKT_AUTHENTICATION_URL, null, null, `hash=${hash}`);
    }
    static addFile(data) {
        return new HttpClient()
            .addHeaders({"Content-type": "application/octet-stream"})
            .post(`${FILESTORE_URL}/${FILES_COLLECTION}`,
                null, null, data);
    }
    static getFile(id) {
        const params = new Map();
        params.set("id", id);
        return new HttpClient()
            .get(`${FILESTORE_URL}/${FILE}`, params, null,
            {"responseType": "blob"});
    }
    static getFileAttributes(id) {
        const params = new Map();
        params.set("id", id);
        return new HttpClient()
            .addHeaders({"Accept": "application/json"})
            .get(`${FILESTORE_URL}/${FILE_ATTRIBUTES}`, params, null, {});
    }
    static addMetadata(id, data) {
        let url = id;
        let params = null;
        if (!id.startsWith(FILESTORE_URL)) {
            params = new Map();
            params.set("id", id);
            url = `${FILESTORE_URL}/${FILE}`;
        }
        return new HttpClient()
            .addHeaders({"Content-type": "application/json"})
            .post(url, params, null, data);
    }
    static searchFiles(data) {
        return new HttpClient()
            .addHeaders({"Content-type": "application/json"})
            .post(`${FILESTORE_URL}/${FILES_COLLECTION}`,
                null, null, data);
    }
}

export default StoresConnector;

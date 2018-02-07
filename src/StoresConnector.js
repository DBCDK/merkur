/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import {HttpClient} from "./HttpClient.js";

const FILESTORE_URL = process.env.FILESTORE_URL || "filestore-url-not-set";

const FILES_COLLECTION = "files";

class StoresConnector {
    static addFile(data) {
        return new HttpClient()
            .addHeaders({"Content-type": "application/octet-stream"})
            .post(`${FILESTORE_URL}/${FILES_COLLECTION}`,
                null, null, data);
    }
    static addMetadata(url, data) {
        return new HttpClient()
            .addHeaders({"Content-type": "application/json"})
            .post(url, null, null, data);
    }
    static searchFiles(data) {
        return new HttpClient()
            .addHeaders({"Content-type": "application/json"})
            .post(`${FILESTORE_URL}/${FILES_COLLECTION}`,
                null, null, data);
    }
}

export default StoresConnector;

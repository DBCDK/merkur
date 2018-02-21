/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import constants from "../constants";
import {HttpClient} from "../HttpClient";

class Uploader {
    static uploadFileWithMetadata(fileData, metadata) {
        const httpClient = new HttpClient()
            .addHeaders({"Content-type": "application/octet-stream"});
        httpClient.post(constants.filesAddEndpoint, null, null, fileData).end()
                .then(response => {
            const json = JSON.parse(response.text);
            const metadataRequest = {"url": json.header.location,
                "metadata": metadata};
            return httpClient.addHeaders({"Content-type": "application/json"})
                .post(constants.filesAddMetadataEndpoint,
                null, null, metadataRequest).end();
        }).catch(err => console.error(err));
    }
}

export default Uploader;

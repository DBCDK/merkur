/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import constants from "../constants";
import {HttpClient} from "../HttpClient";

class Uploader {
    static uploadFileWithMetadata(fileData, metadata) {
        const httpClient = new HttpClient();
        httpClient.post(constants.filesAddEndpoint, null, null, fileData).promise
                .then(response => {
            const json = JSON.parse(response.text);
            const metadataRequest = {"url": json.header.location,
                "metadata": metadata};
            return httpClient.post(constants.filesAddMetadataEndpoint,
                null, null, metadataRequest).promise;
        }).catch(err => console.error(err));
    }
}

export default Uploader;

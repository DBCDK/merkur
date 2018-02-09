/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import constants from "../constants";
import {HttpClient} from "../HttpClient";

const getFileMetadata = selector => {
    const request = new HttpClient()
        .addHeaders({"Content-type": "application/json"})
        .post(constants.filesSearchEndpoint, null, null, selector);
    return request.promise;
};

const mapResponseToMetadataList = response => {
    const list = JSON.parse(response);
    return list.map(item => FileAttributes.fromJson(item));
};

class FileAttributes {
    static fromJson(json) {
        /*
         * to enable inheriting this method properly, use `new this()`
         * otherwise, if the object is instantiated as new Ancestry()
         * the object returned by an inheriting class will be an instance
         * of the parent class rather than an instance of the inherting class
         */
        const fileAttributes = new this();
        fileAttributes.id = json.id;
        fileAttributes.creationTime = json.creationTime;
        fileAttributes.byteSize = json.byteSize;
        fileAttributes.metadata = json.metadata;
        return fileAttributes;
    }
}

export {getFileMetadata, mapResponseToMetadataList, FileAttributes};

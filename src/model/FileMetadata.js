/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

class FileMetadata {
    constructor(name, agency, origin) {
        this.name = name;
        this.agency = agency;
        this.origin = origin;
    }
    toJson() {
        return JSON.stringify(this);
    }
}

export default FileMetadata;

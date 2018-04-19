/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

class FileMetadata {
    constructor(name, agency, origin, claimed = false) {
        this.name = name;
        this.agency = agency;
        this.origin = origin;
        this.claimed = claimed;
    }
    toJson() {
        return JSON.stringify(this);
    }
    static verify(metadata) {
        const requiredFields = ["name", "agency", "origin", "claimed"];
        if(!requiredFields.every(field => metadata[field] !== undefined &&
                metadata[field] !== null)) {
            return false;
        }
        if(!Number.isSafeInteger(metadata.agency)) return false;
        if (typeof(metadata.claimed) !== typeof(true)) return false;
        return true;
    }
}

export default FileMetadata;

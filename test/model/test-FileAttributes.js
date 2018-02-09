/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import {expect} from "chai";

import {
    mapResponseToMetadataList, FileAttributes
} from "../../src/model/FileAttributes";

describe("FileAttributes", () => {
    it("instantiate from json", () => {
        const str = "{\"id\":1,\"creationTime\":1517905042583, " +
            "\"byteSize\":5,\"metadata\":{\"origin\": \"posthus\", " +
            "\"agencyid\": 20017}}";
        const js = JSON.parse(str);
        const fileAttributes = FileAttributes.fromJson(js);
        expect(fileAttributes).to.have.property("id");
        expect(fileAttributes).to.have.property("creationTime");
        expect(fileAttributes).to.have.property("byteSize");
        expect(fileAttributes).to.have.property("metadata");

        expect(fileAttributes.id).to.equal(1);
        expect(fileAttributes.creationTime).to.equal(1517905042583);
        expect(fileAttributes.byteSize).to.equal(5);
        expect(fileAttributes.metadata).to.deep.equal({"origin": "posthus",
            "agencyid": 20017});
    });
    it("mapResponseToMetadataList", () => {
        const str = "[{\"id\":1,\"creationTime\":1517905042583," +
            "\"byteSize\":5,\"metadata\":{\"origin\": \"posthus\"," +
            "\"agencyid\": 20017}},{\"id\":2,\"creationTime\":1517905944552," +
            "\"byteSize\":5,\"metadata\":{\"origin\": \"posthus\"," +
            "\"agencyid\": 20017}},{\"id\":3,\"creationTime\":1517905945267," +
            "\"byteSize\":5,\"metadata\":{\"origin\": \"posthus\"," +
            "\"agencyid\": 20017}},{\"id\":5,\"creationTime\":1517905946362," +
            "\"byteSize\":5,\"metadata\":{\"origin\": \"extern\"," +
            "\"agencyid\": 20017}}]";
        const metadataList = mapResponseToMetadataList(str);

        expect(metadataList).to.have.property("length");
        expect(metadataList.length).to.equal(4);

        const metadata = metadataList[0];
        expect(metadata).to.have.property("id");
        expect(metadata.id).to.equal(1);
    });
});

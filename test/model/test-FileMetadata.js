/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import {expect} from "chai";

import FileMetadata from "../../src/model/FileMetadata";

describe("FileMetadata", () => {
    it("constructor", () => {
        const metadata = new FileMetadata("name", 123123, "origin");
        expect(metadata).to.have.property("name");
        expect(metadata).to.have.property("agency");
        expect(metadata).to.have.property("origin");
        expect(metadata.name).to.equal("name");
        expect(metadata.agency).to.equal(123123);
        expect(metadata.origin).to.equal("origin");
    });

    it("toJson", () => {
        const metadata = new FileMetadata("name", 123123, "origin");
        const json = metadata.toJson();
        expect(json).to.equal("{\"name\":\"name\",\"agency\":123123," +
            "\"origin\":\"origin\"}");
    });
});

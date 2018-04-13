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
            "\"origin\":\"origin\",\"claimed\":false}");
    });
    it("verify", () => {
        let metadata = JSON.parse('{"name": "spongebob", "agency": 123123, ' +
            '"origin": "bikini bottom", "claimed": false}');
        expect(FileMetadata.verify(metadata)).to.equal(true);

        metadata = JSON.parse('{"name": "spongebob", "origin": ' +
            '"bikini bottom", "claimed": false}');
        expect(FileMetadata.verify(metadata)).to.equal(false);

        metadata = JSON.parse('{"name": "spongebob", "agency": 123123, ' +
            '"claimed": false}');
        expect(FileMetadata.verify(metadata)).to.equal(false);

        metadata = JSON.parse('{"agency": 123123, "origin": "bikini bottom", ' +
            '"claimed": false}');
        expect(FileMetadata.verify(metadata)).to.equal(false);

        metadata = JSON.parse('{"name": "spongebob", "agency": ' +
            '"123123", "origin": "bikini bottom", "claimed": false}');
        expect(FileMetadata.verify(metadata)).to.equal(false);

        metadata = JSON.parse('{"name": "spongebob", "agency": ' +
            '9007199254740992, "origin": "bikini bottom", "claimed": false}');
        expect(FileMetadata.verify(metadata)).to.equal(false);

        metadata = JSON.parse('{"name": "spongebob", "agency": 123123, ' +
            '"origin": "bikini bottom"}');
        expect(FileMetadata.verify(metadata)).to.equal(false);

        metadata = JSON.parse('{"name": "spongebob", "agency": 123123, ' +
            '"origin": "bikini bottom", "claimed": "no"}');
        expect(FileMetadata.verify(metadata)).to.equal(false);
    });
});

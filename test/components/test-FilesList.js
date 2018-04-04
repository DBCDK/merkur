/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt
 */

import {expect} from "chai";

import {
    File
} from "../../src/components/FilesList";

describe("FilesList", () => {
    it("File.byteSizeToHumanReadableSI", () => {
        expect(File.byteSizeToHumanReadableSI(0)).to.equal("0 B");
        expect(File.byteSizeToHumanReadableSI(42)).to.equal("42 B");
        expect(File.byteSizeToHumanReadableSI(4322)).to.equal("4.32 kB");
        expect(File.byteSizeToHumanReadableSI(324232132)).to.equal("324.23 MB");
        expect(File.byteSizeToHumanReadableSI(22e9)).to.equal("22 GB");
        expect(File.byteSizeToHumanReadableSI(64.22e12)).to.equal("64.22 TB");
        expect(File.byteSizeToHumanReadableSI(76.22e15)).to.equal("76.22 PB");
        expect(File.byteSizeToHumanReadableSI(64.66e18)).to.equal("64.66 EB");
        expect(File.byteSizeToHumanReadableSI(77.11e21)).to.equal("77.11 ZB");
        expect(File.byteSizeToHumanReadableSI(22e24)).to.equal("22 YB");
    });
});
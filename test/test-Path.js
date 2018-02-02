/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import {expect} from "chai";

import Path from "../src/Path";

describe("Path object", () => {
    it("bind path elements", () => {
        const path = new Path("inner/:goddess");
        expect(path).to.have.property("path");
        expect(path.path).to.equal("inner/:goddess");

        path.bind("goddess", "anastasia-steele");
        expect(path.path).to.equal("inner/anastasia-steele");
    });
});

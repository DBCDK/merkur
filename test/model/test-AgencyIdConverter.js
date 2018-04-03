/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import {expect} from "chai";

import AgencyIdConverter from "../../src/model/AgencyIdConverter";
import {
    IllegalArgumentException, NullPointerException
} from "../../src/Exceptions";

describe("AgencyIdConverter", () => {
    it("agency id from string", () => {
        const agency = "010100";
        const expected = 10100;
        expect(AgencyIdConverter.agencyIdFromString(agency))
            .to.equal(expected);
    });
    it("agency id from string nullpointer", () => {
        assertThrows(AgencyIdConverter.agencyIdFromString,
            NullPointerException, [null]);
    });
    it("agency id to string", () => {
        const agency = AgencyIdConverter.agencyIdToString(4);
        const expected = "000004"
        expect(agency).to.equal(expected);
    });
    it("agency id to string nullpointer", () => {
        assertThrows(AgencyIdConverter.agencyIdToString,
            NullPointerException, [null]);
    });
    it("agency id too long", () => {
        assertThrows(AgencyIdConverter.agencyIdToString,
            IllegalArgumentException, [812398123]);
    });
});

const assertThrows = (f, exception, args=null) => {
    try {
        f.apply(null, args);
    } catch(e) {
        // chaijs .throw doesn't seem to be able to match the exception
        // if it doesn't inherit from Error (which we cannot do due to
        // limitations in babel)
        expect(e).to.be.an.instanceof(exception);
    }
};

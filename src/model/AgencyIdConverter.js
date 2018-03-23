/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import {IllegalArgumentException, NullPointerException} from "../Exceptions";

class AgencyIdConverter {
    static agencyIdToString(agency, padding=6, paddingChar="0") {
        if(agency === null || agency === undefined) {
            throw new NullPointerException(
                "agency id cannot be null or undefined");
        }
        const agencyString = agency.toString();
        if(agencyString.length > padding) {
            throw new IllegalArgumentException(
                `agency string "${agencyString}" is longer than padding ` +
                `${padding}`);
        }
        const missingPadding = padding - agencyString.length;
        return paddingChar.repeat(missingPadding) + agencyString;
    }
    static agencyIdFromString(agency) {
        if(agency === null || agency === undefined) {
            throw new NullPointerException(
                "agency id cannot be null or undefined");
        }
        return Number.parseInt(agency);
    }
}

export default AgencyIdConverter;

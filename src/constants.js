/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

const constants = {
    loginEndpoint: "/login",
    filesEndpoint: "/files",
    filesUnclaimedEndpoint: "/files/unclaimed",
    fileClaimedEndpoint: "/files/:id/claimed",
    fileEndpoint: "/files/:id",
    filesAddEndpoint: "/files/add",
    filesAddMetadataEndpoint: "/files/metadata",
    filesSearchEndpoint: "/files/search",
    defaultOrigin: "posthus",
    adminAgency: '010100'
};
Object.freeze(constants);

export default constants;

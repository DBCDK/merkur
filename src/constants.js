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
    defaultOrigin: "merkur",
    defaultCategory: "dataout",
    adminAgency: '010100',
    oldDbcPosthusLink: "https://netpunkt.dk/form_forward.php?redir=http://dbcposthus.dbc.dk/dataleverancer/index.php"
};
Object.freeze(constants);

export default constants;

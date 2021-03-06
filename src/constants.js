/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

const constants = {
    loginEndpoint: "/login",
    logoutEndpoint: "/logout",
    filesEndpoint: "/files",
    filesUnclaimedEndpoint: "/files/unclaimed",
    conversionsEndpoint: "/conversions",
    conversionsUnclaimedEndpoint: "/conversions/unclaimed",
    periodicJobsEndpoint: "/periodic-jobs",
    periodicJobsUnclaimedEndpoint: "/periodic-jobs/unclaimed",
    fileClaimedEndpoint: "/files/:id/claimed",
    fileEndpoint: "/files/:id",
    filesAddEndpoint: "/files/add",
    filesAddMetadataEndpoint: "/files/metadata",
    filesSearchEndpoint: "/files/search",
    conversionsOrigin: "dataio/sink/marcconv",
    periodicJobsOrigin: "dataio/sink/periodic-jobs",
    defaultCategory: "dataout",
    adminAgency: '010100',
    oldDbcPosthusLink: "http://dbcposthus.dbc.dk/dataleverancer/index.php"
};
Object.freeze(constants);

export default constants;

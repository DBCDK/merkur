/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import BodyParser from "body-parser";
import Express from "express";
import session from "express-session";
import {Server} from "http";
import path from "path";

import constants from "./constants";
import * as AuthController from "./controllers/AuthController";
import * as FilesController from "./controllers/FilesController";
import SessionMemoryStore from "session-memory-store"

const app = new Express();
const server = new Server(app);

const MemoryStore = SessionMemoryStore(session);
const auth_session = AuthController.auth_session;
auth_session.store = new MemoryStore({
    expires: 86400, // seconds
});
app.use(session(auth_session));

app.use(Express.static(path.join(__dirname, "static")));
// necessary for parsing POST request bodies
app.use(BodyParser.json({
    type: "application/json"
}));

app.get(constants.loginEndpoint, AuthController.login);

// Be very careful when changing the order of the
// resource paths below, especially fileEndpoint.
// Express seems a bit buggy in this regard.

app.get(constants.filesEndpoint, FilesController.getFiles);
app.get(constants.filesUnclaimedEndpoint, FilesController.getUnclaimedFiles);
app.get(constants.fileEndpoint, FilesController.getFile);
app.post(constants.fileClaimedEndpoint, FilesController.postFileClaimed);
app.post(constants.filesSearchEndpoint, FilesController.searchFiles);
app.post(constants.filesAddMetadataEndpoint, FilesController.uploadMetadata);
app.post(constants.filesAddEndpoint, FilesController.uploadFile);

// handle the rest of the routing in the client
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/static/index.html"));
});

const port = process.env.port || 3000;

server.listen(port, err => {
    if(err) {
        return console.error(err);
    }
    console.info(`server listening on port ${port}`);
});

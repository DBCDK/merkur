/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import BodyParser from "body-parser";
import Busboy from "busboy";
import Express from "express";
import session from "express-session";
import {Server} from "http";
import path from "path";

import constants from "./constants";
import FileMetadata from "./model/FileMetadata";
import StoresConnector from "./StoresConnector";
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

app.get(constants.filesEndpoint, FilesController.getFiles);
app.get(constants.filesUnclaimedEndpoint, FilesController.getUnclaimedFiles);
app.post(constants.fileClaimedEndpoint, FilesController.postFileClaimed);

// ToDo: move file realated methods into FilesController

app.post(constants.filesAddMetadataEndpoint, (req, res) => {
    return handleMetadata(req.body.url, req.body.metadata, res);
});

app.get(constants.fileEndpoint, (req, res) => {
    StoresConnector.getFile(req.params.id).end().then(response => {
        res.status(200).send(response.body)
    }).catch(err => res.status(500).send(
        `error while getting file ${req.params.id}: ${err}`));
});

app.post(constants.filesAddEndpoint, (req, res) => {
    if(req.is("multipart/form-data")) {
        return handleFileFormData(req, res);
    } else if(req.is("application/octet-stream")) {
        return handleFile(req, res);
    } else {
        res.sendStatus(415);
    }
});

const handleMetadata = (url, metadata, res) => {
    if(url === undefined || url === null) {
        return res.status(400).send("request missing url in json body");
    } else if(metadata === undefined || metadata === null) {
        return res.status(400).send("request missing metadata in json body");
    } else if(!FileMetadata.verify(metadata)) {
        return res.status(400).send(`request metadata ` +
            `${JSON.stringify(metadata)} does not pass validation`);
    }
    StoresConnector.addMetadata(url, metadata)
            .end().then(json =>
        res.status(200).send(json)
    ).catch(err => res.status(500).send(err));
};

const handleFileFormData = (req, res) => {
    const metadata = {};
    let promise = null;
    const busboy = new Busboy({headers: req.headers});
    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
        metadata.name = filename;
        promise = addFile(file).catch(err => handleError(filename, err, res));
    });
    busboy.on("field", (fieldname, value, fieldnameTruncated,
            valueTruncated, encoding, mimetype) => {
        const valueAsInt = Number.parseInt(value);
        if(!Number.isNaN(valueAsInt)) {
            metadata[fieldname] = valueAsInt;
        } else {
            metadata[fieldname] = value;
        }
    });
    busboy.on("finish", () => {
        if(promise === null) {
            return res.status(400).send("must specify file to upload");
        }
        if(metadata.origin === undefined || metadata.origin === null) {
            metadata.origin = constants.defaultOrigin;
        }
        promise.then(addFileResponse => {
                const url = addFileResponse.headers.location;
                return handleMetadata(url, metadata, res);
            }).catch(err => handleError(metadata.name, err, res));
    });
    req.pipe(busboy);
};

const handleError = (filename, err, res) => {
    if(err.status !== undefined && err.msg !== undefined) {
        return res.status(err.status).send(err.msg);
    } else {
        return res.status(500).send(
            `error uploading ${filename}: ${err}`);
    }
};

const handleFile = (req, res) => {
    addFile(req).then(json => res.status(200).send(json))
        .catch(err => {
            if(err.status !== undefined && err.msg !== undefined) {
                res.status(err.status).send(err.msg);
            } else {
                res.status(500).send(err);
            }
        });
};

const addFile = file => {
    return new Promise((resolve, reject) => {
        const request = StoresConnector.addFile(null);
        let size = 0;
        file.on("data", buffer => {
            request.write(buffer);
            size += buffer.length;
        });
        file.on("end", () => {
            if(size === 0) {
                reject({
                    status: 400,
                    msg: "must supply a non-empty request entity"
                });
            }
            request.end().then(json => resolve(json))
                .catch(err => reject(err));
        });
    });
};

app.post(constants.filesSearchEndpoint, (req, res) => {
    StoresConnector.searchFiles(req.body).end().then(json =>
        res.status(200).send(json.text)
    ).catch(err => res.status(500).send(err));
});

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

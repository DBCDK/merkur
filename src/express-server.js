/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import BodyParser from "body-parser";
import Express from "express";
import {Server} from "http";
import path from "path";

import constants from "./constants";
import StoresConnector from "./StoresConnector";

const app = new Express();
const server = new Server(app);
app.use(Express.static(path.join(__dirname, "static")));
// necessary for parsing POST request bodies
app.use(BodyParser.json());

app.post(constants.filesAddMetadataEndpoint, (req, res) => {
    if(req.body.url === undefined) {
        res.status(400).send("request missing url in json body");
        return 1;
    } else if(req.body.metadata === undefined) {
        res.status(400).send("request missing metadata in json body");
        return 1;
    }
    StoresConnector.addMetadata(req.body.url, req.body.metadata)
            .promise.then(json =>
        res.status(200).send(json)
    ).catch(err => res.status(500).send(err));
});

app.get(constants.fileEndpoint, (req, res) => {
    StoresConnector.getFile(req.params.id).promise.then(response => {
        res.status(200).send(response.body)
    }).catch(err => res.status(500).send(
        `error while getting file ${req.params.id}: ${err}`));
});

app.post(constants.filesAddEndpoint, (req, res) => {
    let buffers = [];
    req.on("data", buffer => buffers.push(buffer));
    req.on("end", () => {
        let size = 0;
        buffers.forEach(buffer => size += buffer.length);
        if(size === 0) {
            res.status(400).send("must supply a non-empty request entity");
            return 1;
        }
        const data = Buffer.alloc(size);
        let pos = 0;
        buffers.forEach(buffer => {
            buffer.copy(data, pos);
            pos += buffer.length;
        });
        StoresConnector.addFile(data).promise.then(json => {
            res.status(200).send(json);
        }).catch(err => res.status(500).send(err));
    });
});

app.post(constants.filesSearchEndpoint, (req, res) => {
    StoresConnector.searchFiles(req.body).promise.then(json =>
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

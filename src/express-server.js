/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import Express from "express";
import {Server} from "http";
import path from "path";

import constants from "./constants";
import StoresConnector from "./StoresConnector";

const app = new Express();
const server = new Server(app);
app.use(Express.static(path.join(__dirname, "static")));

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

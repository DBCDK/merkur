/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import Express from "express";
import {Server} from "http";
import path from "path";

const app = new Express();
const server = new Server(app);
app.use(Express.static(path.join(__dirname, "static")));

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

/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import React from "react";
import {Route, Switch} from "react-router-dom";

import AdminMode from "./AdminMode";
import AdminUpload from "./AdminUpload";
import NotFound from "./NotFound";

const Main = () => (
    <div id="main">
        <Switch>
            <Route exact path="/" component={AdminMode}/>
            <Route exact path="/upload" component={AdminUpload}/>
            <Route path="*" component={NotFound}/>
        </Switch>
    </div>
)

export default Main;

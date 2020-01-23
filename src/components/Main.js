/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import React from "react";
import {Route, Switch} from "react-router-dom";

import ConversionsInventory from "./ConversionsInventory";
import PeriodicJobsInventory from "./PeriodicJobsInventory";
import Upload from "./Upload";
import NotFound from "./NotFound";

const Main = () => (
    <div id="main">
        <Switch>
            <Route exact path="/" component={ConversionsInventory}/>
            <Route exact path="/converted" component={ConversionsInventory}/>
            <Route exact path="/delivered" component={PeriodicJobsInventory}/>
            <Route exact path="/upload" component={Upload}/>
            <Route path="*" component={NotFound}/>
        </Switch>
    </div>
)

export default Main;

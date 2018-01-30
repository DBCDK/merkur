/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";

import App from "./App";

class AppRoutes extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        );
    }
}

export default AppRoutes;

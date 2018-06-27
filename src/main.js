/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";

import AppRoutes from "./components/AppRoutes";

ReactDOM.render(<AppRoutes/>, document.getElementById("react-container"));

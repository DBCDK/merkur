/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import React from "react";

import Main from "./Main";
import Sidebar from "./Sidebar";

class App extends React.Component {
    render() {
        return (
            <div>
                <Sidebar/>
                <Main/>
            </div>
        );
    }
}

export default App;

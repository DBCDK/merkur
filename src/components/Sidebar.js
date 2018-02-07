/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import React from "react";
import {Link} from "react-router-dom";

class Sidebar extends React.PureComponent {
    render() {
        return (
            <div className="wrapper">
                <nav id="sidebar">
                    <h1>dbc file central</h1>
                    <ul>
                        <li><Link to="/">list</Link></li>
                        <li><Link to="/upload">upload</Link></li>
                    </ul>
                </nav>
            </div>
        );
    }
}

export default Sidebar;

/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import React from "react";
import {I18n} from 'react-i18next';
import i18n from '../i18n';
import {UserContext} from './UserContext';
import queryString from "query-string";
import constants from "../constants";
import {HttpClient} from "../HttpClient";

import Main from "./Main";
import Sidebar from "./Sidebar";

function getUserState(agencyid) {
    if(agencyid === 10100) {
        return {user: {agency: 0, internalUser: true}};
    } else {
        return {user: {agency: agencyid, internalUser: false}};
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                agency: -1,
                internalUser: false
            }
        }
    }

    login() {
        const client = new HttpClient();
        client.get(constants.loginEndpoint, null,
            {hash: queryString.parseUrl(window.location.href).query.hash})
            .end()
            .then(response => {
                this.setState(getUserState(Number.parseInt(response.text)));
            })
            .catch(err => {
                // manipulate window.location instead of redirect
                // to avoid CORS error
                window.location = err.response.text;
            });
    }

    componentWillMount() {
        this.login();
    }

    render() {
        return (
            <I18n>
                {
                    (t) => {
                        return (
                            <UserContext.Provider value={this.state.user}>
                            <div>
                                <header><div><h4>{t('App_name')}</h4></div></header>
                                <Sidebar/>
                                <Main/>
                                <footer>
                                    <div>
                                        <p>{t('App_footer')} <a href="https://kundeservice.dbc.dk/">kundeservice.dbc.dk</a></p>
                                    </div>
                                </footer>
                            </div>
                            </UserContext.Provider>
                        )
                    }
                }
            </I18n>
        );
    }
}

export default App;

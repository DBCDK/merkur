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
    if (agencyid === constants.adminAgency) {
        return {user: {agency: agencyid, internalUser: true}};
    } else {
        return {user: {agency: agencyid, internalUser: false}};
    }
}

function getCustomerSupportLink() {
   return (<a href="https://kundeservice.dbc.dk/">kundeservice.dbc.dk</a>)
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
            {code: queryString.parseUrl(window.location.href).query.code})
            .end()
            .then(response => {
                this.setState(getUserState(response.text));
            })
            .catch(err => {
                if( err.status == 403 ) {
                    // manipulate window.location instead of redirect
                    // to avoid CORS error
                    window.location = err.response.text;
                } else {
                    this.setState(getUserState(-1));
                }
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
                                <header><div><h4>{t('App_name')} - {this.state.user.agency}</h4></div></header>
                                {this.state.user.agency === -1 ? (
                                    <div>
                                        <p className="error">{t('Authentication_service_error')} {getCustomerSupportLink()}</p>
                                    </div>
                                ) : (
                                    <div>
                                        <Sidebar/>
                                        <Main/>
                                    </div>
                                )}
                                <footer>
                                    <div>
                                        <p>{t('App_footer')} {getCustomerSupportLink()}</p>
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

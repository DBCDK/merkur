/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import React from "react";
import {I18n} from 'react-i18next';
import i18n from '../i18n';
import {UserContext} from './UserContext';
import Cookies from "universal-cookie";
import queryString from "query-string";
import AgencyIdConverter from "../model/AgencyIdConverter";
import LoginAuthorizer from "../model/LoginAuthorizer";
import RedirectUrlHandler from "../model/RedirectUrlHandler";

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
    componentWillMount() {
        const cookies = new Cookies();
        if(cookies.get("netpunkt-auth")) {
            const agencyid = AgencyIdConverter.agencyIdFromString(
                cookies.get("netpunkt-auth"));
            this.setState(getUserState(agencyid));
        } else {
            const qs = queryString.parseUrl(window.location.href).query;
            LoginAuthorizer.authorizeHash(qs.hash).then(res => {
                    const agencyid = AgencyIdConverter.agencyIdFromString(res);
                    this.setState(getUserState(agencyid));
                    // should also have {secure: true}
                    // 86400: 24H in seconds
                    cookies.set("netpunkt-auth", agencyid, {maxAge: 86400});
                })
                .catch(error => {
                    console.error("error getting agency id", error);
                    RedirectUrlHandler.getRedirectUrl()
                        // use window.open instead of Redirect from
                        // react-router-dom because we need to go to another domain
                        .then(res => window.open(res.text))
                        .catch(redirectError => {
                            console.error("error getting redirect url",
                                redirectError);
                            this.setState({error});
                        });
                });
        }
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

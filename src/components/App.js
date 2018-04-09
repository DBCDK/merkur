/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import React from "react";
import {I18n} from 'react-i18next';
import i18n from '../i18n';

import Main from "./Main";
import Sidebar from "./Sidebar";

class App extends React.Component {
    render() {
        return (
            <I18n>
                {
                    (t) => {
                        return (
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
                        )
                    }
                }
            </I18n>
        );
    }
}

export default App;

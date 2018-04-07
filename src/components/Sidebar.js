/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import React from "react";
import {Link} from "react-router-dom";
import {I18n} from 'react-i18next';
import i18n from '../i18n';

class Sidebar extends React.PureComponent {
    render() {
        return (
            <I18n>
                {
                    (t) => {
                        return (
                            <div className="wrapper">
                                <nav id="sidebar">
                                    <h1>{t('App_name')}</h1>
                                    <ul>
                                        <li><Link to="/">{t('Sidebar_list')}</Link></li>
                                        <li><Link to="/upload">{t('Sidebar_upload')}</Link></li>
                                    </ul>
                                </nav>
                            </div>
                        )
                    }
                }
            </I18n>
        );
    }
}

export default Sidebar;

/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import React from "react";
import {Link} from "react-router-dom";
import {I18n} from 'react-i18next';
import i18n from '../i18n';
import {UserContext} from './UserContext';
import constants from "../constants";

class Sidebar extends React.PureComponent {
    render() {
        return (
            <I18n>
                {
                    (t) => {
                        return (
                            <UserContext.Consumer>
                                {user => (
                                    <div className="wrapper">
                                        <nav id="sidebar">
                                            {user.internalUser
                                                ? (
                                                    <ul>
                                                        <li><Link to="/converted">{t('Sidebar_conversions')}</Link></li>
                                                        <li><Link to="/upload">{t('Sidebar_upload')}</Link></li>
                                                        <li><a href={constants.oldDbcPosthusLink} target="_blank">{t('Sidebar_oldDbcPosthus')}</a></li>
                                                    </ul>)
                                                : (
                                                    <ul>
                                                        <li><a href={constants.oldDbcPosthusLink} target="_blank">{t('Sidebar_oldDbcPosthus')}</a></li>
                                                    </ul>)
                                            }
                                        </nav>
                                    </div>
                                )}
                            </UserContext.Consumer>
                        )
                    }
                }
            </I18n>
        );
    }
}

export default Sidebar;

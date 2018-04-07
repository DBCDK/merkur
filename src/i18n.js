/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
import {reactI18nextModule} from 'react-i18next';

i18n
    .use(XHR)
    .use(reactI18nextModule)
    .init({
        lng: 'da',
        fallbackLng: 'da',
        debug: true,

        ns: ['translations'],
        defaultNS: 'translations',

        interpolation: {
            escapeValue: false, // not needed for react!!
        },
    });

export default i18n;

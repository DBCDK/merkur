/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import React from 'react';

const BusySpinner = ({label}) => (
    <div>
        <i className="fa fa-spinner fa-pulse fa-2x"></i> {label}
    </div>
);

export default BusySpinner;
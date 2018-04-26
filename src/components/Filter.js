/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import React from "react";
import PropTypes from "prop-types";
import i18n from '../i18n';
import constants from "../constants";

class Filter extends React.PureComponent {
    constructor(props) {
        super(props);
        this.onInput = this.onInput.bind(this);
    }
    onInput({target}) {
        this.props.onInput(target.value);
    }
    render() {
        return (
            <select onInput={this.onInput}>
                <option value={constants.adminAgency}>{i18n.t('FilesList_Filter_all')}</option>
                {
                    this.props.items.map(item => <option key={item} value={item}>{item}</option>)
                }
            </select>
        );
    }
}

Filter.propTypes = {
    items: PropTypes.array,
    onInput: PropTypes.func
};

Filter.defaultProps = {
    items: [],
    onInput: event => console.log("no-op for Filter.onInput", event)
};

export default Filter;

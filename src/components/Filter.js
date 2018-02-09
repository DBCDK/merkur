/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import React from "react";
import PropTypes from "prop-types";

class Filter extends React.PureComponent {
    constructor(props) {
        super(props);
        this.onInput = this.onInput.bind(this);
    }
    onInput({target}) {
        this.props.onInput(Number.parseInt(target.value));
    }
    render() {
        return (
            <select onInput={this.onInput}>
            <option value={0}>all</option>
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

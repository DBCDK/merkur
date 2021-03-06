/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import React from "react";
import PropTypes from "prop-types";
import i18n from '../i18n';

class UploadForm extends React.Component {
    constructor(props) {
        super(props);
        this.onFilesChosen = this.props.onFilesChosen.bind(this);
    }
    render() {
        return (
            <div className="form-group">
                <label htmlFor="file-upload">{i18n.t('UploadForm_choose_file')}</label>
                <input type="file" name="file-upload" onChange={this.onFilesChosen}/>
            </div>
        );
    }
}

UploadForm.propTypes = {
    onFilesChosen: PropTypes.func
};

UploadForm.defaultProps = {
    onFilesChosen: event =>
        console.log("no-op for files chosen handler: ", event)
};

export default UploadForm;

/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import React from "react";
import PropTypes from "prop-types";
import {I18n} from 'react-i18next';
import i18n from '../i18n';

class UploadForm extends React.Component {
    constructor(props) {
        super(props);
        this.onFilesChosen = this.props.onFilesChosen.bind(this);
    }
    render() {
        return (
            <I18n>
                {
                    (t) => {
                        return (
                            <div className="form-group">
                                <label htmlFor="file-upload">{t('UploadForm_choose_file')}</label>
                                <input type="file" name="file-upload" onChange={this.onFilesChosen}/>
                            </div>
                        )
                    }
                }
            </I18n>
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

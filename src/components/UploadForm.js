/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import React from "react";
import PropTypes from "prop-types";

class UploadForm extends React.Component {
    constructor(props) {
        super(props);
        this.onFilesChosen = this.props.onFilesChosen.bind(this);
        this.onClick = this.onClick.bind(this);
    }
    onClick(event) {
        event.preventDefault();
        this.props.onClick(event);
    }
    render() {
        return (
            <form>
                <div className="form-group">
                    <label htmlFor="file-upload">select file to upload</label>
                    <input type="file" name="file-upload" onChange={this.onFilesChosen}/>
                </div>
                <button type="submit" onClick={this.onClick}>upload</button>
            </form>
        );
    }
}

UploadForm.propTypes = {
    onClick: PropTypes.func,
    onFilesChosen: PropTypes.func
};

UploadForm.defaultProps = {
    onClick: event => console.log("no-up for onClick: ", event),
    onFilesChosen: event =>
        console.log("no-op for files chosen handler: ", event)
};

export default UploadForm;

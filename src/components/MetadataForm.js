/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import React from "react";
import PropTypes from "prop-types";

import FileMetadata from "../model/FileMetadata";
import UploadForm from "./UploadForm";

class MetadataForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {file: null};
        this.onClick = this.onClick.bind(this);
        this.onFilesChosen = this.onFilesChosen.bind(this);
    }
    onClick(event) {
        event.preventDefault();
        if(this.state.file === null) {
            alert("no file selected");
            return 1;
        }
        const form = event.target.form;
        const metadata = new FileMetadata(form.name.value,
            Number.parseInt(form.agency.value), "posthus");
        this.props.onClick(this.state.file, metadata);
    }
    onFilesChosen({target}) {
        this.setState({file: target.files[0]});
    }
    render() {
        return (
            <form>
                <div className="form-group">
                    <label htmlFor="name">name:</label>
                    <input type="text" name="name"/>
                </div>
                <div className="form-group">
                    <label htmlFor="agency">agency:</label>
                    <input type="text" inputMode="numeric" pattern="\d+" name="agency"/>
                </div>
                <UploadForm onFilesChosen={this.onFilesChosen}/>
                <button type="submit" onClick={this.onClick}>upload</button>
            </form>
        );
    }
}

MetadataForm.propTypes = {
    onClick: PropTypes.func
};

MetadataForm.defaultProps = {
    onClick: event => console.log("no-up for onClick: ", event)
};

export default MetadataForm;
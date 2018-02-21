/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import React from "react";

import MetadataForm from "./MetadataForm";
import Uploader from "../model/Uploader";
import UploadForm from "./UploadForm";

class AdminUpload extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    onClick(file, data) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onerror = err => {
            alert("error while uploading file: " + err);
        };
        reader.onload = ({target}) => {
            Uploader.uploadFileWithMetadata(target.result, data);
        };
    }
    render() {
        return (
            <MetadataForm onClick={this.onClick}/>
        );
    }
}

export default AdminUpload;

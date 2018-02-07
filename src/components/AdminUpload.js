/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import React from "react";

import MetadataForm from "./MetadataForm";
import UploadForm from "./UploadForm";

class AdminUpload extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    onClick(data) {
        console.log(data);
    }
    render() {
        return (
            <MetadataForm onClick={this.onClick}/>
        );
    }
}

export default AdminUpload;

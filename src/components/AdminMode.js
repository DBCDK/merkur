/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import React from "react";

import FilesList from "./FilesList";
import {
    getFile, getFileMetadata, mapResponseToMetadataList
} from "../model/FileAttributes";

class AdminMode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {files: []}
        this.onItemClick = this.onItemClick.bind(this);
    }
    onItemClick(id) {
        getFile(id).then(res =>{
            // we need a way of streaming the blob to the client which
            // is supported by modern browser and allows us to set a filename
            window.open(URL.createObjectURL(res.body));
        }).catch(err => alert(
            `error generating download url for file ${id}: ${err}`));
    }
    componentWillMount() {
        getFileMetadata({"origin": "posthus"}).then(response => {
            const metadataList = mapResponseToMetadataList(response.text);
            this.setState({files: metadataList});
        }).catch(err => alert("error getting file metadata: " + err));
    }
    render() {
        return (
            <FilesList metadataList={this.state.files} onItemClick={this.onItemClick}/>
        );
    }
}

export default AdminMode;

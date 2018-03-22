/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import React from "react";

import FilesList from "./FilesList";
import Filter from "./Filter";
import {
    getFile, getFileMetadata, mapResponseToMetadataList
} from "../model/FileAttributes";

class AdminMode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {files: []}
        this.getBlobUrl = this.getBlobUrl.bind(this);
        this.onAgencyFilterInput = this.onAgencyFilterInput.bind(this);
    }
    getBlobUrl(id) {
        return new Promise((resolve, reject) => {
            getFile(id).then(res => {
                resolve(URL.createObjectURL(res.body));
            }).catch(err => {
                reject(`error generating download url for file ${id}: ${err}`);
            });
        });
    }
    componentWillMount() {
        getFileMetadata({"origin": "posthus"}).then(response => {
            const metadataList = mapResponseToMetadataList(response.text);
            this.setState({files: metadataList});
        }).catch(err => alert("error getting file metadata: " + err));
    }
    onAgencyFilterInput(agency) {
        this.setState({agency});
    }
    render() {
        const agencies = Array.from(new Set(this.state.files.map(
            item => item.metadata.agency)));
        return (
            <FilesList metadataList={this.state.files}
                    getBlobUrl={this.getBlobUrl} agency={this.state.agency}>
                <Filter items={agencies} onInput={this.onAgencyFilterInput}/>
            </FilesList>
        );
    }
}

export default AdminMode;

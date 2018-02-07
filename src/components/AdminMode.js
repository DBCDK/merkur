/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import React from "react";

import FilesList from "./FilesList";
import Sidebar from "./Sidebar";
import {
    getFileMetadata, mapResponseToMetadataList
} from "../model/FileAttributes";

class AdminMode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {files: []}
    }
    componentWillMount() {
        getFileMetadata({"origin": "posthus"}).then(response => {
            const metadataList = mapResponseToMetadataList(response.text);
            this.setState({files: metadataList});
        });
    }
    render() {
        return (
            <div>
                <Sidebar/>
                <FilesList metadataList={this.state.files}/>
            </div>
        );
    }
}

export default AdminMode;

/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import React from "react";
import i18n from '../i18n';
import {UserContext} from './UserContext';

import {FilesList} from "./FilesList";
import Filter from "./Filter";
import {
    getFile, getFileMetadata, mapResponseToMetadataList
} from "../model/FileAttributes";

class ErrorView extends React.Component {
    render() {
        return (
            <p className="error">{this.props.error}</p>
        );
    }
}

class AdminMode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {files: [], agency: -1};
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
        this.fetchFiles();
    }
    fetchFiles() {
        // poll for active client session while server-side returns
        // 511 Network Authentication Required
        getFileMetadata({}).then(response => {
            const metadataList = mapResponseToMetadataList(response.text);
            this.setState({files: metadataList});
        }).catch(err => {
            if (err.response.status === 511) {
                this.fetchFiles();
            } else {
                alert(i18n.t('Fetch_metadata_error') + ": " + err);
            }
        });
    }
    onAgencyFilterInput(agency) {
        this.setState({agency});
    }
    render() {
        const agencies = Array.from(new Set(this.state.files.map(
            item => item.metadata.agency)));
        return (
            <UserContext.Consumer>
                {user => (
                    <div>
                        {this.state.error !== undefined ? (
                            <ErrorView error={`error showing files list: ${this.state.error}`}/>
                        ) : (<span/>)}
                        <FilesList metadataList={this.state.files}
                                   getBlobUrl={this.getBlobUrl} agency={this.state.agency !== -1
                                           ? this.state.agency
                                           : user.agency}>
                            {user.internalUser ? (
                                <Filter items={agencies} onInput={this.onAgencyFilterInput}/>
                            ) : (<span/>)}
                        </FilesList>
                    </div>
                )}
            </UserContext.Consumer>
        );
    }
}

export default AdminMode;

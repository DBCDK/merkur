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
import constants from "../constants";

class ErrorView extends React.Component {
    render() {
        return (
            <p className="error">{this.props.error}</p>
        );
    }
}

class ConversionsInventory extends React.Component {
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
        getFileMetadata({
            "category": constants.defaultCategory,
            "origin": constants.conversionsOrigin
        }).then(response => {
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
                        <h3>{i18n.t('ConversionsInventory_heading')}</h3>
                        <h6>
                            {i18n.t('Inventory_file_not_found?')}
                            <a href={constants.oldDbcPosthusLink} target="_blank">
                                {i18n.t('Sidebar_oldDbcPosthus')}
                            </a>
                        </h6>
                        <br/>
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

export default ConversionsInventory;

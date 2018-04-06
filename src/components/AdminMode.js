/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import Cookies from "universal-cookie";
import React from "react";
import queryString from "query-string";

import AgencyIdConverter from "../model/AgencyIdConverter";
import {FilesList} from "./FilesList";
import Filter from "./Filter";
import LoginAuthorizer from "../model/LoginAuthorizer";
import RedirectUrlHandler from "../model/RedirectUrlHandler";
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

function getAgencyIdState(agencyid) {
    if(agencyid === 10100) {
        return {agency: 0, internalUser: true};
    } else {
        return {agency: agencyid};
    }
}

class AdminMode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {files: [], agency: -1, internalUser: false}
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
        const cookies = new Cookies();
        if(cookies.get("netpunkt-auth")) {
            const agencyid = AgencyIdConverter.agencyIdFromString(
                cookies.get("netpunkt-auth"));
            this.setState(getAgencyIdState(agencyid));
        } else {
            const qs = queryString.parse(this.props.location.search);
            LoginAuthorizer.authorizeHash(qs.hash).then(res => {
                    const agencyid = AgencyIdConverter.agencyIdFromString(res);
                    this.setState(getAgencyIdState(agencyid));
                    // should also have {secure: true}
                    // 86400: 24H in seconds
                    cookies.set("netpunkt-auth", agencyid, {maxAge: 86400});
                })
                .catch(error => {
                    console.error("error getting agency id", error);
                    RedirectUrlHandler.getRedirectUrl()
                        // use window.open instead of Redirect from
                        // react-router-dom because we need to go to another domain
                        .then(res => window.open(res.text))
                        .catch(redirectError => {
                            console.error("error getting redirect url",
                                redirectError);
                            this.setState({error});
                        });
                });
        }
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
            <div>
                {this.state.error !== undefined ? (
                    <ErrorView error={`error showing files list: ${this.state.error}`}/>
                ) : (<span/>)}
                <FilesList metadataList={this.state.files}
                        getBlobUrl={this.getBlobUrl} agency={this.state.agency}>
                    {this.state.internalUser ? (
                            <Filter items={agencies} onInput={this.onAgencyFilterInput}/>
                        ) : (<span/>)}
                </FilesList>
            </div>
        );
    }
}

export default AdminMode;

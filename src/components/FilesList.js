/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import React from "react";
import PropTypes from "prop-types";

import Filter from "./Filter";

class File extends React.Component {
    constructor(props) {
        super(props);
        this.state = {url: "not-found"};
    }
    componentWillMount() {
        this.props.getBlobUrl(this.props.id).then(res =>
            this.setState({url: res})
        ).catch(err =>
            alert("error while getting file download link: " + err));
    }
    render() {
        return (
            <tr>
                <td><a href={this.state.url} download={this.props.metadata.name}>{this.props.metadata.name}</a></td>
                <td>{this.props.metadata.agency}</td>
                <td>{File.formatCreationTime(this.props.creationTime)}</td>
            </tr>
        );
    }
    static formatCreationTime(millisecondsSinceEpoch) {
        return new Date(millisecondsSinceEpoch).toLocaleString('da-DK')
    }
}

File.propTypes = {
    getBlobUrl: PropTypes.func,
    id: PropTypes.number,
    metadata: PropTypes.object
};

File.defaultProps = {
    getBlobUrl: id => Promise.resolve(`no-op promise for ${id}`),
    id: -1,
    metadata: {}
};

class FilesList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {agency: 0};
        this.onAgencyFilterInput = this.onAgencyFilterInput.bind(this);
    }
    onAgencyFilterInput(agency) {
        this.setState({agency});
    }
    render() {
        const agencies = Array.from(new Set(this.props.metadataList.map(
            item => item.metadata.agency)));
        return (
            <div>
                <h2>files:</h2>
                <Filter items={agencies} onInput={this.onAgencyFilterInput}/>
                <table className="table">
                    <thead>
                        <tr>
                            <th>name</th>
                            <th>agency</th>
                            <th>creation time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                        this.props.metadataList.filter(item =>
                            this.state.agency === 0 ||
                            item.metadata.agency === this.state.agency)
                            .map(item => <File key={item.id} id={item.id}
                            creationTime={item.creationTime}
                            metadata={item.metadata}
                            getBlobUrl={this.props.getBlobUrl}/>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }
}

FilesList.propTypes = {
    metadataList: PropTypes.array
};

FilesList.defaultProps = {
    metadataList: []
};

export default FilesList;

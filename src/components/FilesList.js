/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import React from "react";
import PropTypes from "prop-types";

import Filter from "./Filter";

class File extends React.PureComponent {
    render() {
        return (
            <tr>
                <td>{this.props.metadata.name}</td>
            </tr>
        );
    }
}

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
                        </tr>
                    </thead>
                    <tbody>
                        {
                        this.props.metadataList.filter(item =>
                            this.state.agency === 0 ||
                            item.metadata.agency === this.state.agency)
                            .map(item => <File key={item.id}
                            metadata={item.metadata}/>
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

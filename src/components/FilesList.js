/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import React from "react";
import PropTypes from "prop-types";

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
    render() {
        return (
            <div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.metadataList.map(item =>
                            <File key={item.id} metadata={item.metadata}/>
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

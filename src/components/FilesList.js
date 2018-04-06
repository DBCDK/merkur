/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import React from "react";
import PropTypes from "prop-types";
import {I18n} from 'react-i18next';
import i18n from '../i18n';

class File extends React.Component {
    constructor(props) {
        super(props);
        this.state = {url: "not-found"};
    }
    componentWillMount() {
        this.props.getBlobUrl(this.props.id).then(res =>
            this.setState({url: res})
        ).catch(err =>
            alert(i18n.t('Fetch_download_link_error') + ": " + err));
    }
    render() {
        return (
            <tr>
                <td><a href={this.state.url} download={this.props.metadata.name}>{this.props.metadata.name}</a></td>
                <td>{this.props.metadata.agency}</td>
                <td>{File.formatCreationTime(this.props.creationTime)}</td>
                <td>{File.byteSizeToHumanReadableSI(this.props.byteSize)}</td>
            </tr>
        );
    }
    static formatCreationTime(millisecondsSinceEpoch) {
        return new Date(millisecondsSinceEpoch).toLocaleString('da-DK')
    }
    /*
     * We use the units kilo, mega, giga, etc., in a manner consistent
     * with their meaning in the International System of Units (SI),
     * namely as powers of 1000.
     */
    static byteSizeToHumanReadableSI(bytes) {
        const e = (Math.log(bytes) / Math.log(1e3)) | 0;
        return +(bytes / Math.pow(1e3, e)).toFixed(2) + ' ' + ('kMGTPEZY'[e - 1] || '') + 'B';
    };
}

File.propTypes = {
    getBlobUrl: PropTypes.func,
    id: PropTypes.number,
    creationTime: PropTypes.number,
    metadata: PropTypes.object
};

File.defaultProps = {
    getBlobUrl: id => Promise.resolve(`no-op promise for ${id}`),
    id: -1,
    creationTime: 0,
    metadata: {}
};

class FilesList extends React.Component {
    render() {
        return (
            <I18n>
                {
                    (t) => {
                        return (<div>
                                <h2>{t('FilesList_heading')}</h2>
                                {this.props.children}
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th>{t('File_name')}</th>
                                        <th>{t('File_agency')}</th>
                                        <th>{t('File_creationTime')}</th>
                                        <th>{t('File_size')}</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.props.metadataList.filter(item =>
                                            this.props.agency === 0 ||
                                            item.metadata.agency === this.props.agency)
                                            .map(item => <File key={item.id} id={item.id}
                                                               creationTime={item.creationTime}
                                                               byteSize={item.byteSize}
                                                               metadata={item.metadata}
                                                               getBlobUrl={this.props.getBlobUrl}/>
                                            )}
                                    </tbody>
                                </table>
                            </div>
                        )
                    }
                }
            </I18n>
        );
    }
}

FilesList.propTypes = {
    agency: PropTypes.number,
    metadataList: PropTypes.array
};

FilesList.defaultProps = {
    agency: -1,
    metadataList: []
};

export {
    FilesList,
    File
};

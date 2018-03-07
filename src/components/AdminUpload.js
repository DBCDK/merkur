/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import React from "react";

import MetadataForm from "./MetadataForm";
import BusySpinner from './BusySpinner';
import Uploader from "../model/Uploader";

class AdminUpload extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.onUploadComplete = this.onUploadComplete.bind(this);
        this.state = {
            isUploading: false,    // will be true when upload is in progress
            uploadComplete: false, // will be true when a file has been uploaded
        }
    }

    onClick(file, data) {
        /* Use callback argument for setState to make sure state
           is updated before subsequent asynchronous requests */
        this.setState({ isUploading: true, uploadComplete: false }, () => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onerror = err => {
                alert("error while uploading file: " + err);
            };
            reader.onload = ({target}) => {
                Uploader.uploadFileWithMetadata(target.result, data, this.onUploadComplete);
            };
        });
    }

    onUploadComplete() {
        this.setState({ isUploading: false, uploadComplete: true });
    }

    render() {
        const { isUploading, uploadComplete } = this.state;

        return (
            <div>
                <MetadataForm onClick={this.onClick}/>
                {isUploading ? <BusySpinner label={"uploading..."}/> :
                    uploadComplete ? <div>uploaded</div> : <span/>}
            </div>
        );
    }
}

export default AdminUpload;

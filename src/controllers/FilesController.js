/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import url from "url";
import constants from "../constants";
import Busboy from "busboy";
import StoresConnector from "../StoresConnector";
import AgencyIdConverter from "../model/AgencyIdConverter";
import FileMetadata from "../model/FileMetadata";
import * as AuthController from "./AuthController";
import logger from '../Logger';

const mapToUtc = (millisecondsSinceEpoch) => {
        return new Date(millisecondsSinceEpoch).toISOString();
};

const mapToFileObjectList = (request, response) => {
    const jsonArray = JSON.parse(response.text);
    return jsonArray.map(item => mapToFileObject(request, item))
};

const mapToFileObject = (request, fileAttributes) => {
    const file = {
        'filename': fileAttributes.metadata.name,
        'creationTimeUTC': mapToUtc(fileAttributes.creationTime),
        'byteSize': fileAttributes.byteSize,
        'downloadUrl': mapToFileUrl(request, fileAttributes, constants.fileEndpoint),
    };
    if (!fileAttributes.metadata.claimed) {
        file.claimedUrl = mapToFileUrl(request, fileAttributes, constants.fileClaimedEndpoint);
    }
    return file;
};

const mapToFileUrl = (request, fileAttributes, path) => {
    return url.format({
        protocol: request.protocol,
        host: request.get('host'),
        pathname: path.replace(':id', fileAttributes.id)
    });
};

const getFile = (req, res) => {
    const agency = AuthController.authenticate(req, res);
    if (agency !== undefined) {
        logger.info(`${agency} getting file with id ${req.params.id}`,
            {agency: agency, logger: `${__filename}#getFile`});
        StoresConnector.getFileAttributes(req.params.id).end().then(response => {
            const fileAttributes = response.body;
            if (constants.adminAgency !== agency
                && AgencyIdConverter.agencyIdToString(fileAttributes.metadata.agency) !== agency) {
                logger.info(`${agency} illegal download attempt for file with id ${req.params.id}`,
                    {agency: agency, logger: `${__filename}#getFile`});
                res.status(403).send("Attempt to download file owned by another agency");
            } else {
                StoresConnector.getFile(req.params.id).end().then(response => {
                    res.status(200).send(response.body)
                }).catch(err => res.status(500).send(
                    `error while getting file ${req.params.id}: ${err}`));
            }
        }).catch(err => res.status(500).send(err));
    }
};

const getFiles = (req, res) => {
    const agency = AuthController.authenticate(req, res);
    if (agency !== undefined) {
        logger.info(`${agency} getting files`,
            {agency: agency, logger: `${__filename}#getFiles`});
        StoresConnector.searchFiles({
            "agency": AgencyIdConverter.agencyIdFromString(agency)
        }).end().then(response =>
            res.status(200).send(mapToFileObjectList(req, response))
        ).catch(err => res.status(500).send(err));
    }
};

const getUnclaimedFiles = (req, res) => {
    const agency = AuthController.authenticate(req, res);
    if (agency !== undefined) {
        logger.info(`${agency} getting unclaimed files`,
            {agency: agency, logger: `${__filename}#getUnclaimedFiles`});
        StoresConnector.searchFiles({
            "agency": AgencyIdConverter.agencyIdFromString(agency),
            "claimed": false
        }).end().then(response =>
            res.status(200).send(mapToFileObjectList(req, response))
        ).catch(err => res.status(500).send(err));
    }
};

const postFileClaimed = (req, res) => {
    const agency = AuthController.authenticate(req, res);
    if (agency !== undefined) {
        const id = req.params.id;
        logger.info(`${agency} claiming file with id ${id}`,
            {agency: agency, logger: `${__filename}#postFileClaimed`});
        StoresConnector.getFileAttributes(id).end().then(response => {
            const fileAttributes = response.body;
            if (AgencyIdConverter.agencyIdToString(fileAttributes.metadata.agency) !== agency) {
                logger.info(`${agency} illegal attempt to claim file with id ${id}`,
                    {agency: agency, logger: `${__filename}#postFileClaimed`});
                res.status(403).send("Attempt to claim file owned by another agency");
            } else {
                fileAttributes.metadata.claimed = true;
                StoresConnector.addMetadata(id, fileAttributes.metadata).end()
                    .then(res.status(200).send())
                    .catch(err => res.status(500).send(err));
            }
        }).catch(err => res.status(500).send(err));
    }
};

const searchFiles = (req, res) => {
    if (!req.session.agencyid) {
        res.status(511).send();
    } else {
        const searchParam = req.body;
        if (req.session.agencyid === constants.adminAgency) {
            // admin agency sees all files
            searchParam.origin = constants.defaultOrigin;
        } else {
            // ensure non-admin agency only sees its own files
            searchParam.agency = AgencyIdConverter.agencyIdFromString(req.session.agencyid);
        }
        logger.info(`${req.session.agencyid} listing files`,
            {agency: req.session.agencyid, logger: `${__filename}#searchFiles`});
        StoresConnector.searchFiles(searchParam).end().then(json => {
            res.status(200).send(json.text);
        }).catch(err => res.status(500).send(err));
    }
};

const uploadMetadata = (req, res) => {
    const agency = AuthController.authenticate(req, res);
    if (agency !== undefined) {
        if (agency !== constants.adminAgency) {
            logger.info(`${agency} illegal upload attempt`,
                {agency: agency, logger: `${__filename}#uploadMetadata`});
            res.status(403).send("Upload not allowed");
        } else {
            const url = req.body.url;
            const metadata = req.body.metadata;
            if (url === undefined || url === null) {
                return res.status(400).send("request missing url in json body");
            } else if (metadata === undefined || metadata === null) {
                return res.status(400).send("request missing metadata in json body");
            } else if (!FileMetadata.verify(metadata)) {
                return res.status(400).send(`request metadata ` +
                    `${JSON.stringify(metadata)} does not pass validation`);
            }
            logger.info(`${agency} uploading ${JSON.stringify(metadata)} to ${url}`,
                {agency: agency, logger: `${__filename}#uploadMetadata`});
            StoresConnector.addMetadata(url, metadata)
                .end().then(json =>
                res.status(200).send(json)
            ).catch(err => res.status(500).send(err));
        }
    }
};

const uploadFile = (req, res) => {
    const agency = AuthController.authenticate(req, res);
    if (agency !== undefined) {
        if (agency !== constants.adminAgency) {
            logger.info(`${agency} illegal upload attempt`,
                {agency: agency, logger: `${__filename}#uploadFile`});
            res.status(403).send("Upload not allowed");
        } else {
            if (req.is("multipart/form-data")) {
                return handleFileFormDataUpload(req, res);
            } else if (req.is("application/octet-stream")) {
                return handleFileUpload(req, res);
            } else {
                res.sendStatus(415);
            }
        }
    }
};

const handleFileFormDataUpload = (req, res) => {
    const metadata = {};
    let promise = null;
    const busboy = new Busboy({headers: req.headers});
    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
        metadata.name = filename;
        promise = addFile(file).catch(err => handleUploadError(filename, err, res));
    });
    busboy.on("field", (fieldname, value, fieldnameTruncated,
            valueTruncated, encoding, mimetype) => {
        const valueAsInt = Number.parseInt(value);
        if (!Number.isNaN(valueAsInt)) {
            metadata[fieldname] = valueAsInt;
        } else {
            metadata[fieldname] = value;
        }
    });
    busboy.on("finish", () => {
        if (promise === null) {
            return res.status(400).send("must specify file to upload");
        }
        if (metadata.origin === undefined || metadata.origin === null) {
            metadata.origin = constants.defaultOrigin;
        }
        promise.then(addFileResponse => {
                const url = addFileResponse.headers.location;
                return handleMetadata(url, metadata, res);
            }).catch(err => handleUploadError(metadata.name, err, res));
    });
    req.pipe(busboy);
};

const handleUploadError = (filename, err, res) => {
    if (err.status !== undefined && err.msg !== undefined) {
        return res.status(err.status).send(err.msg);
    } else {
        return res.status(500).send(
            `error uploading ${filename}: ${err}`);
    }
};

const handleFileUpload = (req, res) => {
    addFile(req).then(json => res.status(200).send(json))
        .catch(err => {
            if (err.status !== undefined && err.msg !== undefined) {
                res.status(err.status).send(err.msg);
            } else {
                res.status(500).send(err);
            }
        });
};

const addFile = file => {
    return new Promise((resolve, reject) => {
        const request = StoresConnector.addFile(null);
        let size = 0;
        file.on("data", buffer => {
            request.write(buffer);
            size += buffer.length;
        });
        file.on("end", () => {
            if (size === 0) {
                reject({
                    status: 400,
                    msg: "must supply a non-empty request entity"
                });
            }
            request.end().then(json => resolve(json))
                .catch(err => reject(err));
        });
    });
};

export {getFile, getFiles, getUnclaimedFiles, postFileClaimed, searchFiles,
    uploadFile, uploadMetadata}
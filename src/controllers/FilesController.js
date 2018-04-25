/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import url from "url";
import constants from "../constants";
import StoresConnector from "../StoresConnector";
import AgencyIdConverter from "../model/AgencyIdConverter";
import * as AuthController from "./AuthController";

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

const getFiles = (req, res) => {
    const agency = AuthController.authenticate(req, res);
    if (agency !== undefined) {
        StoresConnector.searchFiles({
            "agency": parseInt(agency, 10)
        }).end().then(response =>
            res.status(200).send(mapToFileObjectList(req, response))
        ).catch(err => res.status(500).send(err));
    }
};

const getUnclaimedFiles = (req, res) => {
    const agency = AuthController.authenticate(req, res);
    if (agency !== undefined) {
        StoresConnector.searchFiles({
            "agency": parseInt(agency, 10),
            "claimed": false
        }).end().then(response =>
            res.status(200).send(mapToFileObjectList(req, response))
        ).catch(err => res.status(500).send(err));
    }
};

const postFileClaimed = (req, res) => {
    const agency = AuthController.authenticate(req, res);
    if (agency !== undefined) {
        const id = req.url.split('/')[2];
        StoresConnector.getFileAttributes(id).end().then(response => {
            const fileAttributes = response.body;
            if (AgencyIdConverter.agencyIdToString(fileAttributes.metadata.agency) !== agency) {
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

export {getFiles, getUnclaimedFiles, postFileClaimed}
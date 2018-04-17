/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import url from "url";
import constants from "../constants";
import StoresConnector from "../StoresConnector";
import AgencyIdConverter from "../model/AgencyIdConverter";

const authenticate = (request, response) => {
    // Todo: promote to middleware function
    // Todo: accept netpunkt-auth cookie as well

    if (!request.headers.authorization) {
        response.setHeader('WWW-Authenticate', 'Basic realm="DBC merkur"');
        response.status(401).send("Missing Authorization header");
        return undefined;
    }

    let parts = request.headers.authorization.split(' ');
    if (parts.length !== 2) {
        response.setHeader('WWW-Authenticate', 'Basic realm="DBC merkur"');
        response.status(401).send("Authorization header must include both type and credentials");
        return undefined;
    }

    // verify type
    if (parts[0].toLowerCase() !== 'basic') {
        response.setHeader('WWW-Authenticate', 'Basic realm="DBC merkur"');
        response.status(401).send("Authorization type must be Basic");
        return undefined;
    }
    
    const encodedCredentials = parts[1];
    const decodedCredentials = new Buffer(encodedCredentials, 'base64').toString('utf8');

    parts = decodedCredentials.split(':');
    if (parts.length !== 2) {
        response.setHeader('WWW-Authenticate', 'Basic realm="DBC merkur"');
        response.status(401).send("Apikey must include both user and secret");
        return undefined;
    }

    // ToDo: verify secret parts[1]

    return parts[0];
};

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
    const agency = authenticate(req, res);
    if (agency !== undefined) {
        StoresConnector.searchFiles({
            "agency": parseInt(agency, 10)
        }).end().then(response =>
            res.status(200).send(mapToFileObjectList(req, response))
        ).catch(err => res.status(500).send(err));
    }
};

const getUnclaimedFiles = (req, res) => {
    const agency = authenticate(req, res);
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
    const agency = authenticate(req, res);
    if (agency !== undefined) {
        const id = req.url.split('/')[2];
        StoresConnector.getFileAttributes(id).end().then(response => {
            const fileAttributes = response.body;
            console.log(fileAttributes);
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
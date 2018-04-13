/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import url from "url";
import constants from "../constants";
import StoresConnector from "../StoresConnector";

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
    const list = [];
    for (let i = 0; i < jsonArray.length; i++) {
        const fileAttributes = jsonArray[i];
        list.push(mapToFileObject(request, fileAttributes));
    }
    return list;
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

exports.getUnclaimedFiles = function(req, res) {
    const agency = authenticate(req, res);
    if (agency !== undefined) {
        StoresConnector.searchFiles({
            "origin": "posthus",
            "agency": parseInt(agency, 10),
            "claimed": false
        }).end().then(response =>
            res.status(200).send(mapToFileObjectList(req, response))
        ).catch(err => res.status(500).send(err));
    }
};

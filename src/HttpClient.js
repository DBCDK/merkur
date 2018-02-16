/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import superagent from "superagent";

import Path from "./Path";

class Request {
    constructor(url, data, options) {
        this.aborted = false;
        this.request = this.makeRequest(url, data, options);
    }
    end() {
        return this.request;
    }
    write(data) {
        this.request.write(data);
    }
    abort() {
        if(this.request !== undefined) {
            this.request.abort();
            this.aborted = true;
        } else {
            console.warn("cannot abort while request is undefined");
        }
    }
    makeRequest(url, data, options) {
        const req = superagent(options.method, url)
            .query(options.query)
            .set(options.headers);
        // make superagent accept binary data in responses
        if(options.responseType !== null && options.responseType
                !== undefined) {
            req.responseType(options.responseType);
        }
        if(options.method === "POST" && data !== null) {
            req.send(data);
        }
        return req;
    }
}

class HttpClient {
    constructor() {
        this.headers = {};
    }
    setHeader(header, value) {
        this.headers[header] = value;
    }
    addHeaders(headers) {
        this.headers = this._addHeaders(headers, this.headers);
        return this;
    }
    get(request_url, pathParams, queryObject, options) {
        return this.urlOpen(request_url, HttpClient.Options.GET,
            pathParams, queryObject, null, options);
    }
    post(request_url, pathParams, queryObject, data, options) {
        return this.urlOpen(request_url, HttpClient.Options.POST,
            pathParams, queryObject, data, options);
    }
    delete(requestUrl, pathParams, queryObject, options) {
        return this.urlOpen(requestUrl, HttpClient.Options.DELETE,
            pathParams, queryObject, null, options);
    }
    urlOpen(request_url, method, pathParams, queryObject, data,
            additionalOptions={}) {
        const options = Object.assign(additionalOptions, {
            method: method,
            headers: this.headers,
            query: {}
        });
        const path = new Path(request_url);
        if(pathParams !== null && pathParams !== undefined) {
            pathParams.forEach((value, key) => path.bind(key, value));
        }
        if(queryObject !== null && queryObject !== undefined) {
            options.query = queryObject;
        }
        return this._makeRequest(path.path, data, options);
    }
    _addHeaders(src_headers, dest_headers) {
        const headers = Object.assign({}, dest_headers);
        for(let key in src_headers) {
            if(src_headers.hasOwnProperty(key)) {
                headers[key] = src_headers[key];
            }
        }
        return headers;
    }
    _makeRequest(url, data, options) {
        return new Request(url, data, options);
    }
}

HttpClient.Options = {
    GET: "GET",
    POST: "POST",
    DELETE: "DELETE"
};
Object.freeze(HttpClient.Options);

export {HttpClient, Request};

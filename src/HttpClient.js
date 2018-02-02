/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import superagent from "superagent";

import Path from "./Path";

class Request {
    constructor(url, data, options) {
        this.aborted = false;
        this.promise = this.makeRequest(url, data, options);
    }
    abort() {
        if(this.req !== undefined) {
            this.req.abort();
            this.aborted = true;
        } else {
            console.warn("cannot abort while request is undefined");
        }
    }
    makeRequest(url, data, options) {
        this.req = superagent(options.method, url)
            .query(options.query)
            .set(options.headers);
        if(options.method === "POST" && data !== null) {
            this.req.send(data);
        }
        return new Promise((resolve, reject) => this.req
            .then(response => resolve(response))
            .catch(err => reject(err)));
    }
}

class HttpClient {
    constructor() {
        this.headers = {};
    }
    addHeaders(headers) {
        this.headers = this._addHeaders(headers, this.headers);
        return this;
    }
    get(request_url, pathParams, queryObject) {
        return this.urlOpen(request_url, HttpClient.Options.GET,
            pathParams, queryObject);
    }
    post(request_url, pathParams, queryObject, data) {
        return this.urlOpen(request_url, HttpClient.Options.POST,
            pathParams, queryObject, data);
    }
    delete(requestUrl, pathParams, queryObject) {
        return this.urlOpen(requestUrl, HttpClient.Options.DELETE,
            pathParams, queryObject);
    }
    urlOpen(request_url, method, pathParams, queryObject, data) {
        const options = {
            method: method,
            headers: this.headers,
            query: {}
        };
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

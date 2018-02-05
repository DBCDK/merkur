/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import nock from "nock";
import {expect} from "chai";

import {HttpClient, Request} from "../src/HttpClient";

const TEST_URL = "http://doesnt_exist.dbc.dk";

describe("HttpClient requests", () => {
    it("successful get request", () => {
        nock(TEST_URL).get("/version/10").reply(200,
            {"name": "spongebob scaredypants"});
        const params = new Map();
        params.set("version", 10);
        const request = new HttpClient().get(TEST_URL + "/version/:version",
            params)
        return request.promise.then(res => {
            expect(res).to.have.property("body");
            expect(res.body).to.deep.equal(
                {"name": "spongebob scaredypants"});
        });
    });

    it("failing get request", () => {
        nock(TEST_URL).get("/").reply(500);
        const request = new HttpClient().get(TEST_URL);
        return request.promise.catch(res => {
            expect(res).to.have.property("status");
            expect(res.status).to.equal(500);
        });
    });

    it("successful post request", () => {
        nock(TEST_URL).post("/", {"name": "patrick pinhead"})
            .reply(200, "success");
        const request = new HttpClient().post(TEST_URL, null, null,
            {"name": "patrick pinhead"});
        return request.promise.then(res => {
            expect(res).to.have.property("text");
            expect(res.text).to.equal("success");
        });
    });

    it("failing post request", () => {
        nock(TEST_URL).post("/").reply(500);
        const request = new HttpClient().post(TEST_URL);
        return request.promise.catch(res => {
            expect(res).to.have.property("status");
            expect(res.status).to.equal(500);
        });
    });

    it("successful delete request", () => {
        nock(TEST_URL).delete("/").reply(200, "success");
        const request = new HttpClient().delete(TEST_URL);
        return request.promise.then(res => {
            expect(res).to.have.property("text");
            expect(res.text).to.equal("success");
        });
    });

    it("failing delete request", () => {
        nock(TEST_URL).delete("/").reply(500);
        const request = new HttpClient().delete(TEST_URL);
        return request.promise.catch(res => {
            expect(res).to.have.property("status");
            expect(res.status).to.equal(500);
        });
    });

    it("successful urlOpen", () => {
        nock(TEST_URL, {"User-Agent": "spongebrowser"}).post("/version/3")
            .query({"boss": "eugene+krabs"})
            .reply(200, "success");
        const params = new Map();
        params.set("version", 3);
        const request = new HttpClient()
            .addHeaders({"User-Agent": "spongebrowser"})
            .urlOpen(TEST_URL + "/version/:version", HttpClient.Options.POST,
            params, {"boss": "eugene+krabs"});
        return request.promise.then(res => {
            expect(res).to.have.property("text");
            expect(res.text).to.equal("success");
        });
    });
});

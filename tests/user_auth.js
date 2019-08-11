const app = require("../app");
const mocha = require('mocha');
const User = require('../models/user');
const http = require('http');
const supertest = require("supertest");
const request = supertest(http.createServer(app).listen(3001));
const chai = require("chai");
const should = chai.should();

describe("# Auth", () => {
    const endpoint = "/users/login";

    it("should not login with the right user but wrong password", () => {
        return request.post(endpoint)
            .send({ "email": "testuser", "password": "testpass" })
            .expect(401);
    });

    it("should return invalid credentials error", () => {
        return request.post(endpoint)
            .send({ "email": "testuser", "password": "" })
            .expect(401)
            .then(res => {
                return request.post(endpoint)
                    .send({ "email": "anotheremail", "password": "mypass" })
                    .expect(401);
            });
    });
});
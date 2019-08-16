const app = require("../app");
const mocha = require('mocha');
const User = require('../models/user');
const http = require('http');
const supertest = require("supertest");
const request = supertest(http.createServer(app).listen(3001));
const chai = require("chai");
const assert = chai.assert;
const cookieHelper = require('../helpers/cookieHelper');
const fullCorrectUser = {'name': 'testUser', 'email': 'test_user@test.com', 'password': '1234567' };
const correctUser = {'email': fullCorrectUser.email, 'password': fullCorrectUser.password };
const wrongUser = { 'email': 'testuser', 'password': 'testpass' };

describe("# Auth", () => {
    const login = '/users/login';
    const register = '/users/register';

    it("should return invalid credentials error", () => {
        return request.post(login)
            .send(wrongUser)
            .expect(302)
            .then(function (err) {
                return assert.equal(cookieHelper.hasCookieWithError(err), true);
              });
    });

    it("should login correctly", () => {
        return request.post(login)
            .send(correctUser)
            .expect(302)
            .then(function (err) {
                return assert.equal(cookieHelper.hasCookieWithError(err), false);
              });
    });
});
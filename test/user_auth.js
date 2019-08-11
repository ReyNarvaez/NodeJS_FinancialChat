const common = require('./common');
const request = common.request;

describe("# Auth", () => {
    const endpoint = "/users/login";

    it("should not login with the right user but wrong password", () => {
        return request.post(endpoint)
            .send({ "username": "testuser", "password": "anythingGoesHere" })
            .expect(401);
    });

    it("should return invalid credentials error", () => {
        return request.post(endpoint)
            .send({ "username": "testuser", "password": "" })
            .expect(401)
            .then(res => {
                return request.post(endpoint)
                    .send({ "username": "anotherusername", "password": "mypass" })
                    .expect(401);
            });
    });
});
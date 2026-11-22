const test = require("node:test");
const assert = require("node:assert/strict");

const {
    successResponse,
    STATUS_CODES
} = require("../../src/http/response");

test("successResponse should send JSON response", () => {
    let statusCode;
    let headers;
    let body;

    const res = {
        writeHead(code, responseHeaders) {
            statusCode = code;
            headers = responseHeaders;
        },

        end(responseBody) {
            body = responseBody;
        }
    };

    successResponse(res, { name: "Chhavi" });

    assert.equal(statusCode, STATUS_CODES.OK);
    assert.equal(headers["Content-Type"], "application/json; charset=utf-8");

    assert.deepEqual(JSON.parse(body), {
        success: true,
        data: { name: "Chhavi" }
    });
});
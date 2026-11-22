const test = require("node:test");
const assert = require("node:assert/strict");

const { requestLogger } = require("../../src/express/logger");
const { asyncHandler } = require("../../src/express/asyncHandler");
const { notFound } = require("../../src/express/notFound");
const { errorHandler } = require("../../src/express/errorHandler");
const { authMiddleware } = require("../../src/express/authMiddleware");

// Test 1: Request Logger
test("requestLogger should call next()", () => {
    let nextCalled = false;

    const req = {
        method: "GET",
        originalUrl: "/users"
    };

    const res = {
        on(event, callback) {
            this.finishCallback = callback;
        }
    };

    requestLogger({ logger: () => {} })(req, res, () => {
        nextCalled = true;
    });

    assert.equal(nextCalled, true);
});

// Test 2: Async Handler
test("asyncHandler should pass errors to next()", async () => {
    let receivedError;

    const handler = asyncHandler(async () => {
        throw new Error("Test error");
    });

    handler({}, {}, (error) => {
        receivedError = error;
    });

    await new Promise((resolve) => setImmediate(resolve));

    assert.equal(receivedError.message, "Test error");
});

// Test 3: Not Found Middleware
test("notFound should create a 404 error", () => {
    let receivedError;

    notFound(
        {
            method: "GET",
            originalUrl: "/unknown"
        },
        {},
        (error) => {
            receivedError = error;
        }
    );

    assert.equal(receivedError.statusCode, 404);
    assert.match(receivedError.message, /Route not found/);
});

// Test 4: Error Handler
test("errorHandler should send error response", () => {
    let statusCode;
    let responseBody;

    const res = {
        headersSent: false,

        status(code) {
            statusCode = code;
            return this;
        },

        json(data) {
            responseBody = data;
            return this;
        }
    };

    errorHandler(
        { message: "Not found", statusCode: 404 },
        {},
        res,
        () => {}
    );

    assert.equal(statusCode, 404);
    assert.equal(responseBody.success, false);
    assert.equal(responseBody.error.message, "Not found");
});

// Test 5: Auth Middleware
test("authMiddleware should attach authenticated user", async () => {
    let nextCalled = false;

    const middleware = authMiddleware(async () => ({
        id: 1,
        name: "Chhavi"
    }));

    const req = {};
    const res = {};

    await middleware(req, res, () => {
        nextCalled = true;
    });

    assert.deepEqual(req.user, {
        id: 1,
        name: "Chhavi"
    });

    assert.equal(nextCalled, true);
});

// Test 6: Auth Middleware should reject unauthenticated user
test("authMiddleware should return 401 without a user", async () => {
    let statusCode;
    let responseBody;

    const middleware = authMiddleware(async () => null);

    const res = {
        status(code) {
            statusCode = code;
            return this;
        },

        json(data) {
            responseBody = data;
            return this;
        }
    };

    await middleware({}, res, () => {
        assert.fail("next() should not be called");
    });

    assert.equal(statusCode, 401);
    assert.equal(responseBody.success, false);
});
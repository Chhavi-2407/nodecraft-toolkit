const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const express = require("express");
const http = require("node:http");

const { authMiddleware } = require("../../src/express/authMiddleware");
const { asyncHandler } = require("../../src/express/asyncHandler");
const { notFound } = require("../../src/express/notFound");
const { errorHandler } = require("../../src/express/errorHandler");

const app = express();
app.use(express.json());

const authenticate = async (req) => {
    if (req.headers.authorization === "Bearer demo-token") {
        return { id: 1, name: "Chhavi" };
    }

    return null;
};

app.get("/", (req, res) => {
    res.json({ message: "Welcome to NodeCraft" });
});

app.get("/profile", authMiddleware(authenticate), (req, res) => {
    res.json({ user: req.user });
});

app.get("/error", asyncHandler(async () => {
    throw new Error("Test server error");
}));

app.use(notFound);
app.use(errorHandler);

const server = http.createServer(app);
let baseUrl;

before(async () => {
    await new Promise((resolve) => {
        server.listen(0, "127.0.0.1", resolve);
    });

    const address = server.address();
    baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
    await new Promise((resolve, reject) => {
        server.close((error) => {
            if (error) reject(error);
            else resolve();
        });

        server.closeAllConnections();
    });
});

test("GET / should return welcome message", async () => {
    const response = await fetch(baseUrl);
    const data = await response.json();

    assert.equal(response.status, 200);
    assert.equal(data.message, "Welcome to NodeCraft");
});

test("GET /profile should reject unauthenticated requests", async () => {
    const response = await fetch(`${baseUrl}/profile`);
    const data = await response.json();

    assert.equal(response.status, 401);
    assert.equal(data.success, false);
});

test("GET /profile should allow authenticated requests", async () => {
    const response = await fetch(`${baseUrl}/profile`, {
        headers: {
            Authorization: "Bearer demo-token"
        }
    });

    const data = await response.json();

    assert.equal(response.status, 200);
    assert.equal(data.user.name, "Chhavi");
});

test("Unknown route should return 404", async () => {
    const response = await fetch(`${baseUrl}/unknown`);
    const data = await response.json();

    assert.equal(response.status, 404);
    assert.equal(data.success, false);
});

test("GET /error should return 500", async () => {
    const originalError = console.error;
    console.error = () => {};

    try {
        const response = await fetch(`${baseUrl}/error`);
        const data = await response.json();

        assert.equal(response.status, 500);
        assert.equal(data.success, false);
    } finally {
        console.error = originalError;
    }
});
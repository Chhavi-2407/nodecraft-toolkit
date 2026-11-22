const test = require("node:test");
const assert = require("node:assert/strict");

const { parseArgs } = require("../../src/core/cli");
const { createEventManager } = require("../../src/core/events");
const { getPagination } = require("../../src/database/pagination");

test("parseArgs should parse positional arguments and options", () => {
    const result = parseArgs(["server", "--port", "5000"]);

    assert.deepEqual(result, {
        positional: ["server"],
        options: { port: "5000" }
    });
});

test("parseArgs should support boolean options", () => {
    const result = parseArgs(["--debug"]);

    assert.equal(result.options.debug, true);
});

test("EventManager should publish events", () => {
    const events = createEventManager();
    let received = "";

    events.subscribe("greet", (name) => {
        received = name;
    });

    events.publish("greet", "Chhavi");

    assert.equal(received, "Chhavi");
});

test("getPagination should calculate skip and take", () => {
    const result = getPagination({ page: 3, limit: 10 });

    assert.equal(result.skip, 20);
    assert.equal(result.take, 10);
});
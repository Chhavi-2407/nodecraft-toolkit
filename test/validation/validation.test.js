const test = require("node:test");
const assert = require("node:assert/strict");

const { validateInput } =
    require("../../src/validation/validateInput");

const { validateEnv } =
    require("../../src/validation/envValidator");

test("validateInput should accept valid data", () => {
    const result = validateInput(
        { name: "Chhavi", age: 20 },
        {
            name: { required: true, type: "string" },
            age: { required: true, type: "number", min: 18 }
        }
    );

    assert.equal(result.valid, true);
    assert.deepEqual(result.errors, []);
});

test("validateInput should reject invalid data", () => {
    const result = validateInput(
        { name: "A", age: 15 },
        {
            name: { required: true, type: "string", minLength: 3 },
            age: { required: true, type: "number", min: 18 }
        }
    );

    assert.equal(result.valid, false);
    assert.equal(result.errors.length, 2);
});

test("validateEnv should detect missing variables", () => {
    assert.throws(
        () => validateEnv(["NODECRAFT_TEST_MISSING"]),
        /Missing environment variables/
    );
});
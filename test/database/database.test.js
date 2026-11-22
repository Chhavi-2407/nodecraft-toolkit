const test = require("node:test");
const assert = require("node:assert/strict");

const { createCrudService } =
    require("../../src/database/crudService");

const { handleDatabaseError } =
    require("../../src/database/databaseError");

test("CRUD service should create a record", async () => {
    const model = {
        findMany: async () => [],
        count: async () => 0,
        findUnique: async () => null,
        create: async ({ data }) => ({ id: 1, ...data }),
        update: async ({ data }) => data,
        delete: async () => ({ deleted: true })
    };

    const service = createCrudService(model);

    const result = await service.create({ name: "Chhavi" });

    assert.deepEqual(result, {
        id: 1,
        name: "Chhavi"
    });
});

test("Database error P2002 should map to conflict", () => {
    const error = handleDatabaseError({ code: "P2002" });

    assert.equal(error.statusCode, 409);
});
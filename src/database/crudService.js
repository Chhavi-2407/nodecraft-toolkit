
const { getPagination, getPaginationMeta } =
    require("./pagination");

function createCrudService(model) {
    const requiredMethods = [
        "findMany",
        "count",
        "findUnique",
        "create",
        "update",
        "delete"
    ];

    for (const method of requiredMethods) {
        if (typeof model?.[method] !== "function") {
            throw new TypeError(
                `Database model must implement ${method}()`
            );
        }
    }

    async function getAll(query = {}, options = {}) {
        const pagination = getPagination(query);

        const where = options.where || {};
        const orderBy = options.orderBy || {};

        const [data, total] = await Promise.all([
            model.findMany({
                where,
                orderBy,
                skip: pagination.skip,
                take: pagination.take
            }),
            model.count({ where })
        ]);

        return {
            data,
            pagination: getPaginationMeta(
                total,
                pagination.page,
                pagination.limit
            )
        };
    }

    async function getById(id, options = {}) {
        const data = await model.findUnique({
            where: { [options.idField || "id"]: id }
        });

        if (!data) {
            const error = new Error("Record not found");
            error.statusCode = 404;
            throw error;
        }

        return data;
    }

    async function create(data) {
        return model.create({ data });
    }

    async function update(id, data, options = {}) {
        return model.update({
            where: { [options.idField || "id"]: id },
            data
        });
    }

    async function remove(id, options = {}) {
        return model.delete({
            where: { [options.idField || "id"]: id }
        });
    }

    return {
        getAll,
        getById,
        create,
        update,
        remove
    };
}

module.exports = {
    createCrudService
};

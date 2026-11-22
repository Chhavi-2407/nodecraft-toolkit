
function getPagination(query = {}) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);

    if (!Number.isInteger(page) || page < 1) {
        throw new Error("Page must be a positive integer");
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
        throw new Error("Limit must be between 1 and 100");
    }

    const skip = (page - 1) * limit;

    return {
        page,
        limit,
        skip,
        take: limit
    };
}

function getPaginationMeta(total, page, limit) {
    const totalPages = Math.ceil(total / limit);

    return {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
    };
}

module.exports = {
    getPagination,
    getPaginationMeta
};

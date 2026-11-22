
function notFound(req, res, next) {
    const error = new Error(
        `Route not found: ${req.method} ${req.originalUrl || req.url}`
    );

    error.statusCode = 404;

    next(error);
}

module.exports = {
    notFound
};


function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }

    const statusCode = err.statusCode || err.status || 500;

    const safeStatusCode =
        Number.isInteger(statusCode) &&
        statusCode >= 400 &&
        statusCode <= 599
            ? statusCode
            : 500;

    const message =
        safeStatusCode === 500
            ? "Internal Server Error"
            : err.message || "Something went wrong";

    if (process.env.NODE_ENV !== "production") {
        console.error(err);
    }

    return res.status(safeStatusCode).json({
        success: false,
        error: {
            message
        }
    });
}

module.exports = {
    errorHandler
};

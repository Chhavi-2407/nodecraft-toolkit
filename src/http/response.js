
const STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
};

function sendJSON(res, statusCode, data, headers = {}) {
    if (!res || typeof res.writeHead !== "function" ||
        typeof res.end !== "function") {
        throw new TypeError("Invalid HTTP response object");
    }

    const body = JSON.stringify(data);

    res.writeHead(statusCode, {
        "Content-Type": "application/json; charset=utf-8",
        ...headers
    });

    res.end(body);
}

function successResponse(res, data, statusCode = STATUS_CODES.OK) {
    return sendJSON(res, statusCode, {
        success: true,
        data
    });
}

function errorResponse(res, message, statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR) {
    return sendJSON(res, statusCode, {
        success: false,
        error: message
    });
}


function expressSuccess(res, data, statusCode = STATUS_CODES.OK) {
    return res.status(statusCode).json({
        success: true,
        data
    });
}

function expressError(res, message, statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR) {
    return res.status(statusCode).json({
        success: false,
        error: message
    });
}

module.exports = {
    STATUS_CODES,
    sendJSON,
    successResponse,
    errorResponse,
    expressSuccess,
    expressError
};

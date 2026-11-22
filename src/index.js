const cli = require("./core/cli");
const filesystem = require("./core/filesystem");
const streams = require("./core/streams");
const events = require("./core/events");

const http = require("./http/response");

const logger = require("./express/logger");
const asyncHandler = require("./express/asyncHandler");
const errorHandler = require("./express/errorHandler");
const notFound = require("./express/notFound");
const authMiddleware = require("./express/authMiddleware");

const pagination = require("./database/pagination");
const crudService = require("./database/crudService");
const databaseError = require("./database/databaseError");

const inputValidation = require("./validation/validateInput");
const envValidation = require("./validation/envValidator");

module.exports = {
    core: {
        ...cli,
        ...filesystem,
        ...streams,
        ...events
    },

    http,

    express: {
        ...logger,
        ...asyncHandler,
        ...errorHandler,
        ...notFound,
        ...authMiddleware
    },

    database: {
        ...pagination,
        ...crudService,
        ...databaseError
    },

    validation: {
        ...inputValidation,
        ...envValidation
    }
};
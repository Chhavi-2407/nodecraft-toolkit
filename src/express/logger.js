
function requestLogger(options = {}) {
    const logger = options.logger || console.log;

    return function (req, res, next) {
        const startTime = Date.now();

        res.on("finish", () => {
            const duration = Date.now() - startTime;

            const logMessage =
                `${req.method} ${req.originalUrl || req.url} ` +
                `${res.statusCode} ${duration}ms`;

            logger(logMessage);
        });

        next();
    };
}

module.exports = {
    requestLogger
};

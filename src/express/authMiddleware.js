
function authMiddleware(authenticate) {
    if (typeof authenticate !== "function") {
        throw new TypeError("authenticate must be a function");
    }

    return async function (req, res, next) {
        try {
            const user = await authenticate(req);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: "Unauthorized"
                });
            }

            req.user = user;

            next();
        } catch (error) {
            next(error);
        }
    };
}

module.exports = {
    authMiddleware
};

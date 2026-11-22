
const http = require("node:http");
const { http: httpUtils } = require("..");

const server = http.createServer((req, res) => {
    if (req.url === "/success") {
        return httpUtils.successResponse(res, {
            message: "Operation completed successfully"
        });
    }

    if (req.url === "/created") {
        return httpUtils.successResponse(
            res,
            { id: 1, name: "Chhavi" },
            httpUtils.STATUS_CODES.CREATED
        );
    }

    if (req.url === "/error") {
        return httpUtils.errorResponse(
            res,
            "Something went wrong",
            httpUtils.STATUS_CODES.BAD_REQUEST
        );
    }

    return httpUtils.errorResponse(
        res,
        "Route not found",
        httpUtils.STATUS_CODES.NOT_FOUND
    );
});

server.listen(3001, () => {
    console.log("HTTP demo running at http://localhost:3001");
});

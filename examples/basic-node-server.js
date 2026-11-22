
const http = require("node:http");
const { http: httpUtils } = require("..");

const server = http.createServer((req, res) => {
    if (req.url === "/" && req.method === "GET") {
        return httpUtils.successResponse(res, {
            message: "Welcome to NodeCraft Toolkit",
            server: "Node.js HTTP Server"
        });
    }

    if (req.url === "/users" && req.method === "GET") {
        return httpUtils.successResponse(res, [
            { id: 1, name: "Chhavi" },
            { id: 2, name: "Aditya" }
        ]);
    }

    return httpUtils.errorResponse(
        res,
        "Route not found",
        httpUtils.STATUS_CODES.NOT_FOUND
    );
});

server.listen(3000, () => {
    console.log("Node.js server running at http://localhost:3000");
});

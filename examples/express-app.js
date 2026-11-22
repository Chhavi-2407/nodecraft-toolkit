
const express = require("express");
const toolkit = require("..");

const app = express();

app.use(express.json());

// Request logging middleware
app.use(toolkit.express.requestLogger());

// Demo authentication function
const authenticate = async (req) => {
    const token = req.headers.authorization;

    if (token === "Bearer demo-token") {
        return {
            id: 1,
            name: "Chhavi"
        };
    }

    return null;
};

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to NodeCraft Toolkit API"
    });
});

// Protected profile route
app.get(
    "/profile",
    toolkit.express.authMiddleware(authenticate),
    (req, res) => {
        res.json({
            success: true,
            user: req.user
        });
    }
);

// Async route handler
app.get(
    "/users",
    toolkit.express.asyncHandler(async (req, res) => {
        const users = [
            { id: 1, name: "Chhavi" },
            { id: 2, name: "Aditya" }
        ];

        res.json(users);
    })
);

// Error demonstration route
app.get(
    "/error",
    toolkit.express.asyncHandler(async () => {
        throw new Error("Something went wrong");
    })
);

// 404 and error handling middleware
app.use(toolkit.express.notFound);
app.use(toolkit.express.errorHandler);

app.listen(3000, () => {
    console.log("Express server running at http://localhost:3000");
});

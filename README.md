# NodeCraft Toolkit

A reusable Node.js backend development toolkit that provides commonly used utilities for core Node.js operations, HTTP responses, Express middleware, database operations, and input validation.

NodeCraft Toolkit helps developers avoid rewriting common backend code by providing simple, reusable, and organized utility functions.

## Features

- **Core Utilities:** CLI argument parsing, file system helpers, streams, and event management.
- **HTTP Helpers:** Standardized JSON success and error responses.
- **Express Middleware:** Request logging, async error handling, authentication, and error handling.
- **Database Utilities:** Pagination, reusable CRUD service, and database error handling.
- **Validation:** Input validation and environment variable validation.
- **Easy Integration:** Modular exports and simple CommonJS syntax.

## Requirements

- Node.js 18 or higher
- npm
- Express (optional, required only for Express-related functionality)
- Prisma (optional, required only for the Prisma example)

## Installation

Install the package using npm:

```bash
npm install nodecraft-toolkit
```

For Express-related functionality, install Express:

```bash
npm install express
```

For the Prisma example, install Prisma and Prisma Client:

```bash
npm install @prisma/client
npm install -D prisma
```

## Clone the Repository

To access the source code and examples:

```bash
git clone https://github.com/Chhavi-2407/nodecraft-toolkit.git
cd nodecraft-toolkit
npm install
```

## Usage

Import the required utilities from the package:

```javascript
const toolkit = require("nodecraft-toolkit");

const { core, http, express, database, validation } = toolkit;
```

The package is divided into five main modules.

## 1. Core Utilities

Provides utilities for common Node.js operations.

### CLI Argument Parser

Parse command-line arguments into a structured object.

```javascript
const { core } = require("nodecraft-toolkit");

const args = core.parseArgs(process.argv.slice(2));

console.log(args);
```

### File System Helpers

Provides reusable asynchronous file operations.

```javascript
const { core } = require("nodecraft-toolkit");

async function fileOperations() {
    await core.writeFile("demo.txt", "Hello NodeCraft!");

    const content = await core.readFile("demo.txt");
    console.log(content);

    await core.appendFile("demo.txt", "\nNew content");

    const exists = await core.fileExists("demo.txt");
    console.log(exists);
}

fileOperations();
```

### Event Manager

Provides a simple wrapper around Node.js EventEmitter.

```javascript
const { core } = require("nodecraft-toolkit");

const events = new core.EventManager();

events.on("userCreated", (user) => {
    console.log("New user:", user);
});

events.emit("userCreated", {
    id: 1,
    name: "Chhavi"
});
```

### Stream Utilities

Provides helper functions for working with Node.js streams.

```javascript
const { core } = require("nodecraft-toolkit");

async function streamOperations() {
    const readStream = core.createReadStream("input.txt");
    const writeStream = core.createWriteStream("output.txt");

    await core.pipeStream(readStream, writeStream);
}

streamOperations();
```

## 2. HTTP Utilities

Provides helper functions for sending standardized HTTP responses.

### Send JSON Response

```javascript
const { http } = require("nodecraft-toolkit");

http.sendJSON(res, 200, {
    message: "Success"
});
```

### Success Response

```javascript
const response = http.successResponse(
    "User fetched successfully",
    { id: 1, name: "Chhavi" }
);

console.log(response);
```

### Error Response

```javascript
const response = http.errorResponse(
    "Something went wrong",
    500
);

console.log(response);
```

### Express Response Helpers

```javascript
const { http } = require("nodecraft-toolkit");

app.get("/users", (req, res) => {
    http.expressSuccess(res, "Users fetched successfully", []);
});
```

## 3. Express Middleware

Provides reusable middleware functions for Express applications.

### Request Logger

Logs incoming HTTP requests.

```javascript
const { express } = require("nodecraft-toolkit");

app.use(express.requestLogger);
```

### Async Handler

Wraps asynchronous route handlers and forwards errors to Express error middleware.

```javascript
const { express } = require("nodecraft-toolkit");

app.get(
    "/users",
    express.asyncHandler(async (req, res) => {
        const users = await getUsers();

        res.json(users);
    })
);
```

### Authentication Middleware

Checks whether a request contains a valid authentication token.

```javascript
const { express } = require("nodecraft-toolkit");

app.use(express.authMiddleware((req) => {
    return req.headers.authorization === "Bearer demo-token";
}));
```

### Not Found Middleware

Handles requests to routes that do not exist.

```javascript
app.use(express.notFound);
```

### Error Handler

Handles errors forwarded through Express middleware.

```javascript
app.use(express.errorHandler);
```

**Important:** Register `notFound` and `errorHandler` after your application routes. The error handler should be the last middleware.

## 4. Database Utilities

Provides reusable helpers for pagination, CRUD operations, and database error handling.

### Pagination

Calculate pagination values from page number and page size.

```javascript
const { database } = require("nodecraft-toolkit");

const pagination = database.getPagination(2, 10);

console.log(pagination);
```

### Pagination Metadata

Generate metadata for paginated results.

```javascript
const meta = database.getPaginationMeta(100, 2, 10);

console.log(meta);
```

### CRUD Service

Create a reusable CRUD service using a database model.

```javascript
const { database } = require("nodecraft-toolkit");

const userService = database.createCrudService(prisma.user);

async function operations() {
    const users = await userService.findAll();

    const user = await userService.findById(1);

    const newUser = await userService.create({
        name: "Chhavi",
        email: "chhavi@example.com"
    });

    await userService.update(1, {
        name: "Updated Name"
    });

    await userService.delete(1);
}
```

This example assumes that Prisma Client has been initialized and a compatible `user` model exists in your Prisma schema.

### Database Error Handling

Convert common database errors into readable application errors.

```javascript
const { database } = require("nodecraft-toolkit");

try {
    // Database operation
} catch (error) {
    const handledError = database.handleDatabaseError(error);

    console.log(handledError);
}
```

## 5. Validation Utilities

Provides helpers for validating input data and environment variables.

### Input Validation

```javascript
const { validation } = require("nodecraft-toolkit");

const result = validation.validateInput(
    { name: "Chhavi", email: "chhavi@example.com" },
    {
        name: { required: true },
        email: { required: true, type: "email" }
    }
);

console.log(result);
```

### Environment Variable Validation

```javascript
const { validation } = require("nodecraft-toolkit");

const env = validation.validateEnv(
    ["PORT", "DATABASE_URL"]
);

console.log(env);
```

## Running Examples

The repository includes example applications demonstrating how to use the toolkit.

### Basic Node.js Server

```bash
node examples/basic-node-server.js
```

### Express Application

```bash
node examples/express-app.js
```

### HTTP Demo

```bash
node examples/http-demo.js
```

### Prisma Demo

```bash
node examples/prisma-demo.js
```

The Prisma demo requires a configured database connection and a generated Prisma Client.

## Running Tests

Run the test suite using:

```bash
npm test
```

The project uses Node.js's built-in test runner.

Tests cover:

- Core utilities
- HTTP helpers
- Express middleware
- Express integration
- Database utilities
- Validation functions

## Project Structure

```text
nodecraft-toolkit/
│
├── src/
│   ├── core/
│   │   ├── cli.js
│   │   ├── filesystem.js
│   │   ├── streams.js
│   │   └── events.js
│   │
│   ├── http/
│   │   └── response.js
│   │
│   ├── express/
│   │   ├── logger.js
│   │   ├── asyncHandler.js
│   │   ├── errorHandler.js
│   │   ├── notFound.js
│   │   └── authMiddleware.js
│   │
│   ├── database/
│   │   ├── pagination.js
│   │   ├── crudService.js
│   │   └── databaseError.js
│   │
│   ├── validation/
│   │   ├── validateInput.js
│   │   └── envValidator.js
│   │
│   └── index.js
│
├── test/
│   ├── core/
│   ├── http/
│   ├── express/
│   ├── database/
│   └── validation/
│
├── examples/
│   ├── basic-node-server.js
│   ├── express-app.js
│   ├── http-demo.js
│   └── prisma-demo.js
│
├── index.js
├── package.json
├── package-lock.json
├── README.md
├── LICENSE
└── .gitignore
```

## Technologies Used

- Node.js
- JavaScript
- Express.js
- Prisma ORM (for the example integration)
- npm
- Node.js Built-in Test Runner

## Package Information

- **Package Name:** nodecraft-toolkit
- **Current Published Version:** 1.0.0
- **Author:** Chhavi
- **License:** MIT
- **Node.js Requirement:** >=18

## Links

- **npm Package:** https://www.npmjs.com/package/nodecraft-toolkit
- **GitHub Repository:** https://github.com/Chhavi-2407/nodecraft-toolkit

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Made with Node.js by **Chhavi**.
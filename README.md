# NodeCraft Toolkit

A reusable Node.js backend development toolkit that provides commonly used utilities for building backend applications. It simplifies working with Node.js core modules, HTTP responses, Express middleware, database operations, and input validation.

## Features

- **Core Utilities:** CLI argument parsing, filesystem operations, stream handling, and event management.
- **HTTP Utilities:** Standardized JSON success and error responses.
- **Express Middleware:** Request logging, asynchronous error handling, authentication middleware, 404 handling, and centralized error handling.
- **Database Utilities:** Pagination, reusable CRUD services, and Prisma database error handling.
- **Validation:** Input validation and environment variable validation.

## Requirements

- Node.js 18 or above.
- Express 4 or 5 (optional, required only when using Express utilities).
- Prisma Client (optional, required only when using Prisma integration).

## Installation

Install NodeCraft Toolkit:

```bash
npm install nodecraft-toolkit
```

For Express applications:

```bash
npm install express
```

For Prisma integration:

```bash
npm install @prisma/client
npm install -D prisma
```

Prisma integration also requires a configured Prisma schema, database connection, and generated Prisma Client.

## Usage

Import the toolkit into your Node.js application:

```js
const toolkit = require("nodecraft-toolkit");
```

The toolkit provides five main namespaces:

- `toolkit.core`
- `toolkit.http`
- `toolkit.express`
- `toolkit.database`
- `toolkit.validation`

## 1. Core Utilities

### CLI Argument Parser

Parse command-line arguments into positional arguments and options.

```js
const { parseArgs } = toolkit.core;

const result = parseArgs(["server", "--port", "5000"]);

console.log(result);
```

Output:

```js
{
    positional: ["server"],
    options: {
        port: "5000"
    }
}
```

### Filesystem Operations

Read, write, append, and check files using Node.js filesystem utilities.

```js
const { writeFile, readFile } = toolkit.core;

async function main() {
    await writeFile("demo.txt", "Hello NodeCraft!");

    const content = await readFile("demo.txt");

    console.log(content);
}

main().catch(console.error);
```

Other available functions:

- `appendFile()`
- `createDirectory()`
- `fileExists()`
- `getFileInfo()`

### Event Manager

Create and manage custom events using Node.js EventEmitter.

```js
const { createEventManager } = toolkit.core;

const events = createEventManager();

events.subscribe("userCreated", (user) => {
    console.log("New user:", user);
});

events.publish("userCreated", {
    id: 1,
    name: "Chhavi"
});
```

Other available methods:

- `subscribeOnce()`
- `unsubscribe()`
- `getListeners()`
- `clear()`

### Stream Utilities

Copy files using Node.js readable and writable streams.

```js
const { copyFile } = toolkit.core;

copyFile("source.txt", "destination.txt")
    .then(() => console.log("File copied successfully"))
    .catch(console.error);
```

Other available functions:

- `createReadStream()`
- `createWriteStream()`
- `pipeStream()`

## 2. HTTP Utilities

NodeCraft provides helper functions for sending standardized JSON responses using Node.js HTTP response objects.

```js
const http = require("node:http");
const { http: httpUtils } = toolkit;

const server = http.createServer((req, res) => {
    httpUtils.successResponse(res, {
        message: "Welcome to NodeCraft"
    });
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});
```

Available functions:

| Function | Description |
|---|---|
| `sendJSON()` | Sends a JSON response with a status code and headers. |
| `successResponse()` | Sends a standardized success response. |
| `errorResponse()` | Sends a standardized error response. |
| `expressSuccess()` | Sends a success response using Express. |
| `expressError()` | Sends an error response using Express. |

## 3. Express Middleware

NodeCraft provides reusable middleware for Express applications.

### Request Logger

Logs the HTTP method, request URL, response status, and request duration.

```js
const express = require("express");
const toolkit = require("nodecraft-toolkit");

const app = express();

app.use(express.json());
app.use(toolkit.express.requestLogger());

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to NodeCraft"
    });
});

app.use(toolkit.express.notFound);
app.use(toolkit.express.errorHandler);

app.listen(3000);
```

### Async Handler

Handles errors from asynchronous Express route handlers.

```js
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
```

### Authentication Middleware

Provides a reusable authentication middleware that accepts a custom authentication function.

```js
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

app.get(
    "/profile",
    toolkit.express.authMiddleware(authenticate),
    (req, res) => {
        res.json({
            user: req.user
        });
    }
);
```

The example uses a demonstration token. Real applications should verify credentials securely.

### Available Express Middleware

- `requestLogger()`
- `asyncHandler()`
- `authMiddleware()`
- `notFound`
- `errorHandler`

**Important:** Register `notFound` and `errorHandler` after your application routes. The error handler should be the final middleware.

## 4. Database Utilities

### Pagination

Generate pagination parameters for database queries.

```js
const { database } = toolkit;

const pagination = database.getPagination({
    page: 2,
    limit: 10
});

console.log(pagination);
```

Output:

```js
{
    page: 2,
    limit: 10,
    skip: 10,
    take: 10
}
```

Additional function:

- `getPaginationMeta()` - Generates pagination metadata, including total pages and next/previous page indicators.

### CRUD Service with Prisma

Create reusable CRUD operations using a Prisma model delegate.

```js
const { PrismaClient } = require("@prisma/client");
const { database } = require("nodecraft-toolkit");

const prisma = new PrismaClient();

const userService = database.createCrudService(prisma.user);

async function main() {
    // CREATE
    const user = await userService.create({
        name: "Chhavi",
        email: "chhavi@example.com"
    });

    // READ ALL
    const users = await userService.getAll({
        page: 1,
        limit: 10
    });

    // READ BY ID
    const userById = await userService.getById(user.id);

    // UPDATE
    const updatedUser = await userService.update(user.id, {
        name: "Chhavi Sharma"
    });

    // DELETE
    const deletedUser = await userService.remove(user.id);

    console.log(users, userById, updatedUser, deletedUser);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
```

The CRUD service provides:

- `getAll()`
- `getById()`
- `create()`
- `update()`
- `remove()`

The service expects a Prisma-style model delegate implementing `findMany`, `count`, `findUnique`, `create`, `update`, and `delete`.

### Database Error Handling

Handle common Prisma database errors:

```js
const { database } = require("nodecraft-toolkit");

try {
    // Database operation
} catch (error) {
    throw database.handleDatabaseError(error);
}
```

Supported Prisma error mappings:

- `P2002`: Duplicate record, mapped to HTTP 409.
- `P2025`: Record not found, mapped to HTTP 404.
- `P2003`: Related record constraint error, mapped to HTTP 400.

## 5. Validation Utilities

### Input Validation

Validate required fields, data types, minimum string lengths, and numeric ranges.

```js
const { validation } = toolkit;

const result = validation.validateInput(
    {
        name: "Chhavi",
        age: 20
    },
    {
        name: {
            required: true,
            type: "string",
            minLength: 3
        },
        age: {
            required: true,
            type: "number",
            min: 18
        }
    }
);

console.log(result);
```

Output:

```js
{
    valid: true,
    errors: []
}
```

If the input is invalid, the function returns `valid: false` along with validation error messages.

### Environment Variable Validation

Check whether required environment variables are defined.

```js
const { validation } = toolkit;

try {
    validation.validateEnv([
        "PORT",
        "DATABASE_URL"
    ]);

    console.log("Environment configuration is valid");
} catch (error) {
    console.error(error.message);
}
```

## Running Tests

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd nodecraft-toolkit
```

Install development dependencies:

```bash
npm install
```

Run the automated test suite:

```bash
npm test
```

The project uses Node.js's built-in test runner (`node:test`) and includes unit tests and Express integration tests.

## Project Structure

```text
nodecraft-toolkit/
├── src/
│   ├── core/
│   │   ├── cli.js
│   │   ├── filesystem.js
│   │   ├── streams.js
│   │   └── events.js
│   ├── http/
│   │   └── response.js
│   ├── express/
│   │   ├── logger.js
│   │   ├── asyncHandler.js
│   │   ├── errorHandler.js
│   │   ├── notFound.js
│   │   └── authMiddleware.js
│   ├── database/
│   │   ├── pagination.js
│   │   ├── crudService.js
│   │   └── databaseError.js
│   ├── validation/
│   │   ├── validateInput.js
│   │   └── envValidator.js
│   └── index.js
├── test/
│   ├── core/
│   ├── http/
│   ├── express/
│   ├── database/
│   └── validation/
├── examples/
├── index.js
├── package.json
├── README.md
├── LICENSE
└── .gitignore
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

Chhavi

## npm Package

[NodeCraft Toolkit on npm](https://www.npmjs.com/package/nodecraft-toolkit)

Install using:

```bash
npm install nodecraft-toolkit
```

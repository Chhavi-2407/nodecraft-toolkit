
const fs = require("node:fs");
const { pipeline } = require("node:stream/promises");

function createReadStream(filePath, options = {}) {
    return fs.createReadStream(filePath, options);
}

function createWriteStream(filePath, options = {}) {
    return fs.createWriteStream(filePath, options);
}

async function pipeStream(readable, writable) {
    if (!readable || !writable) {
        throw new TypeError("Readable and writable streams are required");
    }

    await pipeline(readable, writable);

    return true;
}

async function copyFile(source, destination) {
    const readable = createReadStream(source);
    const writable = createWriteStream(destination);

    await pipeline(readable, writable);

    return true;
}

module.exports = {
    createReadStream,
    createWriteStream,
    pipeStream,
    copyFile
};

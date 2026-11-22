
const fs = require("node:fs/promises");
const path = require("node:path");

async function readFile(filePath) {
    return await fs.readFile(filePath, "utf-8");
}

async function writeFile(filePath, content) {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, "utf-8");

    return true;
}

async function appendFile(filePath, content) {
    await fs.appendFile(filePath, content, "utf-8");

    return true;
}

async function createDirectory(dirPath) {
    await fs.mkdir(dirPath, { recursive: true });

    return true;
}

async function fileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch (error) {
        if (error.code === "ENOENT" || error.code === "ENOTDIR") {
            return false;
        }

        throw error;
    }
}

async function getFileInfo(filePath) {
    const stats = await fs.stat(filePath);

    return {
        size: stats.size,
        isFile: stats.isFile(),
        isDirectory: stats.isDirectory(),
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime
    };
}

module.exports = {
    readFile,
    writeFile,
    appendFile,
    createDirectory,
    fileExists,
    getFileInfo
};

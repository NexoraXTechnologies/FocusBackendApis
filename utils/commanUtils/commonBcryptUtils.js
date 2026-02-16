// utils/commanUtils/commonBcryptUtils.js

/**
 * Placeholder for encryption. 
 * Currently returns the text as is. In production, use a library like crypto.
 */
function encryptStatic(text) {
    if (!text) return text;
    return text;
}

/**
 * Placeholder for decryption.
 * Currently returns the text as is.
 */
function decryptStatic(text) {
    if (!text) return text;
    return text;
}

const { client } = require("../../mongoClient");

/**
 * Gets database instance from x-db-name header
 */
async function getDbFromHeader(req) {
    const dbName = req.headers["x-db-name"];
    if (!dbName) {
        throw new Error("DATABASE_NAME_REQUIRED");
    }
    return client.db(dbName);
}

module.exports = {
    encryptStatic,
    decryptStatic,
    getDbFromHeader
};

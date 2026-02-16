// utils/commanUtils/auditUtils.js

/**
 * Builds audit fields for a new record
 */
function buildCreateAudit(userId) {
    return {
        createdBy: userId,
        createdAt: new Date(),
        updatedBy: userId,
        updatedAt: new Date()
    };
}

/**
 * Builds audit fields for an updated record
 */
function buildUpdateAudit(userId) {
    return {
        updatedBy: userId,
        updatedAt: new Date()
    };
}

/**
 * Builds audit fields for a deleted record (soft delete)
 */
function buildDeleteAudit(userId) {
    return {
        deletedBy: userId,
        deletedOn: new Date()
    };
}

/**
 * Helper to decrypt audit fields for response (mocking decryption for now)
 */
function decryptAuditFields(doc) {
    return {
        createdBy: doc.createdBy,
        createdAt: doc.createdAt,
        updatedBy: doc.updatedBy,
        updatedAt: doc.updatedAt,
        deletedBy: doc.deletedBy,
        deletedOn: doc.deletedOn
    };
}

/**
 * Throws error if document is soft deleted
 */
function throwIfSoftDeleted(doc, entityName, id) {
    if (doc && doc.deletedOn) {
        const error = new Error(`${entityName} with ID ${id} is already deleted.`);
        error.statusCode = 410; // Gone
        error.code = "ALREADY_DELETED";
        throw error;
    }
}

module.exports = {
    buildCreateAudit,
    buildUpdateAudit,
    buildDeleteAudit,
    decryptAuditFields,
    throwIfSoftDeleted
};

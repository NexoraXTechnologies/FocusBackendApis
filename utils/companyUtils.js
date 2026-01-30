const normalizeName = require('./normalizeName'); // assuming you already have this

/**
 * Generate a company code
 * @param {string} name - Company name
 * @param {number} sequence - Sequence number for uniqueness
 * @returns {string} Generated company code (A-Z0-9_-)
 */
const generateCompanyCode = (name = '', sequence = 1) => {
  const seqStr = `_${sequence}`;
  let base = normalizeName(name).replace(/\s+/g, '_').toUpperCase();
  const maxBaseLen = 20 - seqStr.length;
  if (base.length > maxBaseLen) base = base.slice(0, maxBaseLen);

  let code = `${base}${seqStr}`;

  if (code.length < 2) code = `C${sequence}`;

  // ensure allowed characters (A-Z0-9_-)
  code = code.replace(/[^A-Z0-9_-]/g, '_');

  return code;
};

module.exports = { generateCompanyCode };

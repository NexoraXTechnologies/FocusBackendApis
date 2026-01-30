const normalizeName = (value = "") => {
  if (typeof value !== "string") return "";

  return value
    .normalize("NFKD")                // handle accented characters
    .replace(/[\u0300-\u036f]/g, "")  // remove diacritics
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")     // remove special chars
    .replace(/\s+/g, " ")             // collapse multiple spaces
    .trim();
};

module.exports = normalizeName;
  
const mongoose = require('mongoose');
const { fetchProductsFromFocus8 } = require('./focus8Service');

const syncProductsFromFocus8 = async () => {
  const focusProducts = await fetchProductsFromFocus8();

  if (!focusProducts.length) {
    return { added: 0 };
  }

  // Access the raw collection directly (no schema)
  const collection = mongoose.connection.collection('focus8_products');

  // Fetch existing sCodes to prevent duplicates
  const existing = await collection.find({}, { projection: { sCode: 1 } }).toArray();
  const existingCodes = new Set(existing.map(p => p.sCode));

  // Filter new products
  const newProducts = focusProducts.filter(
    p => p.sCode && !existingCodes.has(p.sCode)
  );

  if (!newProducts.length) {
    return { added: 0 };
  }

  // Insert raw Focus8 data directly
  await collection.insertMany(newProducts);

  return { added: newProducts.length };
};

module.exports = { syncProductsFromFocus8 };
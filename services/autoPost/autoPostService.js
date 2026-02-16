const mongoose = require('mongoose');
const AutoPostRegistry = require('../../models/autoPostRegistryModel');

const syncProductsForAutoPost = async () => {
  // 1. Fetch products from the raw import collection
  const rawCollection = mongoose.connection.collection('focus8_products');
  const rawProducts = await rawCollection.find({}).toArray();

  if (!rawProducts.length) {
    return { added: 0, message: 'No products found in focus8_products collection.' };
  }

  // 2. Fetch already registered products
  const registered = await AutoPostRegistry.find({ isDeleted: false }).select('productCode');
  const registeredCodes = new Set(registered.map(r => r.productCode));

  // 3. Filter new products based on sCode
  const newProducts = rawProducts.filter(p => p.sCode && !registeredCodes.has(p.sCode));

  if (!newProducts.length) {
    return { added: 0, message: 'All products are already registered.' };
  }

  // 4. Prepare bulk insert
  const inserts = newProducts.map(p => {
    // Calculate default next post date (e.g. 1st of next month)
    const nextPostDate = new Date();
    nextPostDate.setMonth(nextPostDate.getMonth() + 1);
    nextPostDate.setDate(1); // Default to 1st

    return {
      productId: p._id, // Using raw doc _id
      productCode: p.sCode,
      productName: p.sName, // Storing name if schema supports it (or extended)
      frequency: 'MONTHLY',
      nextPostDate,
      isActive: true,
      lastPostedOn: null
    };
  });

  // 5. Insert
  // Note: productId ref might complain if 'Product' model doesn't match ID, but for storage it works.
  await AutoPostRegistry.insertMany(inserts);

  return { added: inserts.length };
};

module.exports = {
  syncProductsForAutoPost
};
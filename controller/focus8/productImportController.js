const { asyncHandler, ApiResponse } = require('../../utils/ResponseHandlers');
const productSyncService = require('../../services/focus8/productImportService');

const importProducts = asyncHandler(async (req, res) => {
  const result = await productSyncService.importProductsFromFocus8();

  return new ApiResponse({
    statusCode: 200,
    success: true,
    message: 'Focus8 product import completed',
    data: result
  }).send(res);
});

const syncProducts = asyncHandler(async (req, res) => {
  // Run sync logic in the background
  productSyncService.syncProductsFromFocus8()
    .then(result => console.log("Background Product Sync Completed:", result))
    .catch(error => console.error("Background Product Sync Failed:", error));

  // Return immediate response to Postman
  return new ApiResponse({
    statusCode: 202,
    success: true,
    message: 'Focus8 product sync process started in the background. Check logs for progress.',
    data: { status: "processing" }
  }).send(res);
});

module.exports = { importProducts, syncProducts };
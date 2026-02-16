const { asyncHandler, ApiResponse } = require('../../utils/ResponseHandlers');
const productSyncService = require('../../services/focus8/productImportService');

const syncProducts = asyncHandler(async (req, res) => {
  const result = await productSyncService.syncProductsFromFocus8();

  return new ApiResponse({
    statusCode: 200,
    success: true,
    message: 'Focus8 product sync completed',
    data: result
  }).send(res);
});

module.exports = { syncProducts };
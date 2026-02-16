const { asyncHandler, ApiResponse } = require('../../utils/ResponseHandlers');
const autoPostService = require('../../services/autoPost/autoPostService');

const syncAutoPostProducts = asyncHandler(async (req, res) => {
  const result = await autoPostService.syncProductsForAutoPost();

  return new ApiResponse({
    statusCode: 200,
    success: true,
    message: 'AutoPost sync completed',
    data: result
  }).send(res);
});

module.exports = {
  syncAutoPostProducts
};
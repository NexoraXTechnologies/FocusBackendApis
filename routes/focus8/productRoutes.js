const express = require('express');
const router = express.Router();

const productImportController = require('../../controller/focus8/productImportController');
const { getProductsController, updateProductMasterController, createProductMasterController, deleteProductController } = require('../../controller/focus8/productController');
const { updateProducts } = require('../../controller/focus8/updateIsPostedController');

// Import products from Focus8 (Just call and store)
router.post('/products/import', productImportController.importProducts);

// Sync products (Update IsPosted in Focus8 and store in local DB)
router.post('/products/sync', productImportController.syncProducts);

// Get Product Master
router.get('/products', getProductsController);

// Create Product Master
router.post('/products/create', createProductMasterController);

// Update Product Master
router.post('/products/update', updateProductMasterController);

// Inactivate Product Master (Delete)
router.post('/products/delete', deleteProductController);

// Update Products Is Posted (Reset to No)
router.post('/updateProductsIsPosted', updateProducts);

module.exports = router;

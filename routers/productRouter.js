const express = require('express');
const router = express.Router();
const { getProducts, addProducts,getProductById } = require('../controllers/productController');
router.get('/products', getProducts);
router.post('/products', addProducts);
router.get('/products/:id',getProductById);

module.exports = router;
const express = require('express');
const router = express.Router();
const upload = require('../middelware/upload');

const {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    addProductImages,
    deleteProductImage,
    updateProductImage,
    addVariant,
    getVariants,
    updateVariant,
    deleteVariant,
    addProductReview,
    getProductReviews,
    updateProductReview,
    deleteProductReview
} = require('../controllers/productController');


router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.post('/products', addProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.post('/products/images/:productId', upload.single('image'), addProductImages);
router.delete('/products/images/:imageId', deleteProductImage);
router.put('/products/images/:imageId', upload.single('image'), updateProductImage);


router.post('/products/:productId/variants', addVariant);
router.get('/products/:productId/variants', getVariants);
router.put('/variants/:variantId', updateVariant);
router.delete('/variants/:variantId', deleteVariant);


router.post('/products/:productId/reviews', addProductReview);
router.get('/products/:productId/reviews', getProductReviews);
router.put('/reviews/:reviewId', updateProductReview);
router.delete('/reviews/:reviewId', deleteProductReview);

module.exports = router;





const express = require('express');
const router = express.Router();
const upload = require('../middelware/upload');

const {
    getOrders,
    createOrder,
    getOrderById,
    updateOrder
} = require('../controllers/orderController');

router.get('/orders', getOrders);
router.post('/orders', createOrder);
router.get('/orders/:id', getOrderById);
router.put('/orders/:id', updateOrder);

module.exports = router;
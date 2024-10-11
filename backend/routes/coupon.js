const express = require('express');
const router = express.Router();
const { applyCoupon } = require('../controllers/coupon');

// Route to apply a coupon
router.post('/apply', applyCoupon);

module.exports = router;

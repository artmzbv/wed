const express = require('express');
const router = express.Router();
const couponController = require('../controllers/coupon');

// Route to create a new coupon (admin use only)
router.post('/create', couponController.createCoupon);

// Route to apply a coupon during payment
router.post('/apply', couponController.applyCoupon);

router.post('/delete', couponController.deleteCoupon); // Changed to POST for delete operation

module.exports = router;

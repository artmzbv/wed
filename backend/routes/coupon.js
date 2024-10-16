const express = require('express');
const router = express.Router();
const couponController = require('../controllers/coupon');

// Route to get all coupons (for listing in the admin dashboard)
router.get('/all', couponController.getAllCoupons);
// Route to create a new coupon (admin use only)
router.post('/create', couponController.createCoupon);
// Route to apply a coupon during payment
router.post('/apply', couponController.applyCoupon);
// Changed to POST for delete operation
router.post('/delete', couponController.deleteCoupon); 

router.post('/check-unique', couponController.checkCoupons)

module.exports = router;

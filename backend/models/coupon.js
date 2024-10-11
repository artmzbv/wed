const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // Coupon code
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true }, // Type of discount
  discountValue: { type: Number, required: true }, // Discount amount
  expirationDate: { type: Date }, // Expiration date
  usageLimit: { type: Number }, // How many times the coupon can be used
  usedCount: { type: Number, default: 0 }, // Track how many times it has been used
});

module.exports = mongoose.model('Coupon', couponSchema);

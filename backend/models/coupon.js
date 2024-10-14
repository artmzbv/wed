const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  line1: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String },
  postal_code: { type: String, required: true },
  country: { type: String, required: true }
});


const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true },
  expirationDate: { type: Date },
  usageLimit: { type: Number },
  usedCount: { type: Number, default: 0 },
  duration: { type: String },
  quantity: { type: Number },
  pricePerItem: { type: Number },
  totalPrice: { type: Number },
  firstName: { type: String },  
  lastName: { type: String },   
  email: { type: String },      
  phone: { type: String },      
  cardType: { type: String, enum: ['physical', 'digital'], required: true },
  address: {
    type: addressSchema,
    required: function() { return this.cardType === 'physical'; },  // Address is required for physical cards
  }
});


module.exports = mongoose.model('Coupon', couponSchema);



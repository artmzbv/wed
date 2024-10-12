const mongoose = require('mongoose');

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
  firstName: { type: String },  // Sender's first name
  lastName: { type: String },   // Sender's last name
//   recipientFirstName: { type: String }, // Recipient's first name
//   recipientLastName: { type: String },  // Recipient's last name
  email: { type: String },      // Email of the user or recipient
  phone: { type: String },      // Phone number of the user or recipient
  cardType: { type: String, enum: ['physical', 'digital'], required: true }  // New field for card type
});

module.exports = mongoose.model('Coupon', couponSchema);



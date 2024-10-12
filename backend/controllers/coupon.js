const Coupon = require('../models/coupon');

exports.getAllCoupons = async (req, res) => {
    try {
      const coupons = await Coupon.find(); // Get all coupons
      res.status(200).json(coupons); // Send them to the client
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch coupons', error: error.message });
    }
  };

  
// Create a new coupon (admin use only)
exports.createCoupon = async (req, res) => {
    const { 
      code, 
      discountType, 
      discountValue, 
      expirationDate, 
      usageLimit, 
      duration, 
      quantity, 
      pricePerItem, 
      totalPrice,
      firstName,
      lastName,
      recipientFirstName,
      recipientLastName,
      email,
      phone,
      isDigital
    } = req.body;
  
    // Log the received data to ensure the backend is receiving everything
    console.log('Received coupon creation data:', {
      code,
      discountType,
      discountValue,
      expirationDate,
      usageLimit,
      duration,
      quantity,
      pricePerItem,
      totalPrice,
      firstName,
      lastName,
      recipientFirstName,
      recipientLastName,
      email,
      phone,
      isDigital
    });
  
    try {
      // Ensure required fields are provided
      if (!code || !discountType || !totalPrice) {
        return res.status(400).json({ message: 'Missing required fields: code, discountType, or totalPrice' });
      }
  
      // Create a new coupon object with all fields
      const newCoupon = new Coupon({
        code,
        discountType,
        discountValue: discountValue || 0, // Default to 0 if not provided
        expirationDate,  // Optional
        usageLimit: usageLimit || 1,  // Default to 1 if not provided
        duration,        // Duration of the coupon
        quantity,        // Number of coupons being issued
        pricePerItem,    // Price per item that the coupon applies to
        totalPrice,      // Total value/price of the coupon
        firstName,       // Sender's first name
        lastName,        // Sender's last name
        // recipientFirstName, // Recipient's first name
        // recipientLastName,  // Recipient's last name
        email,           // Email of the user or recipient
        phone,           // Phone number of the user or recipient
        cardType: isDigital ? 'physical' : 'digital'  
      });
  
      // Save the new coupon to the database
      await newCoupon.save();
  
      // Send success response
      res.status(201).json({ message: 'Coupon created successfully!', coupon: newCoupon });
    } catch (error) {
      // Send failure response in case of an error
      res.status(400).json({ message: 'Failed to create coupon', error: error.message });
    }
  };

// Apply a coupon during payment
exports.applyCoupon = async (req, res) => {
    const { couponCode, originalPrice } = req.body;
  
    try {
      const coupon = await Coupon.findOne({ code: couponCode });
  
      if (!coupon) {
        return res.status(400).json({ message: 'Invalid coupon code' });
      }
  
      const discount = coupon.discountValue; // Assuming it's a fixed discount
      const finalPrice = originalPrice - discount;
  
      res.json({ discount, finalPrice });
    } catch (error) {
      res.status(500).json({ message: 'Failed to apply coupon' });
    }
  };

// Controller: couponController.js
exports.deleteCoupon = async (req, res) => {
    const { couponCode } = req.body; // Use req.body instead of req.params
  
    try {
      const deletedCoupon = await Coupon.findOneAndDelete({ code: couponCode });
  
      if (!deletedCoupon) {
        return res.status(404).json({ message: 'Coupon not found' });
      }
  
      res.status(200).json({ message: 'Coupon deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete coupon', error: error.message });
    }
  };
  
  

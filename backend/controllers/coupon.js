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
  try {
    // Extract data from request body
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
      email,
      phone,
      isDigital,
      address,
    } = req.body;

    // Log the received data to ensure the backend is receiving everything
    console.log('Received coupon creation data:', req.body);

    // Validate required fields (code, discountType, and totalPrice are mandatory)
    // if (!code || !discountType || typeof totalPrice !== 'number') {
    //   return res.status(400).json({
    //     message: 'Missing required fields: code, discountType, or totalPrice',
    //     receivedData: { code, discountType, totalPrice },
    //   });
    // }

    // Validate the address field for physical cards (isDigital === false)
    if (!isDigital && (!address)) {
      return res.status(400).json({
        message: 'Address is required for physical cards.',
        receivedData: { isDigital, address },
      });
    }

    // Create a new coupon object with all the required and optional fields
    const newCoupon = new Coupon({
      code,
      discountType,
      discountValue: discountValue || 0, // Default to 0 if not provided
      expirationDate: expirationDate || null, // Optional field
      usageLimit: usageLimit || 1, // Default to 1 if not provided
      duration: duration || null, // Optional field
      quantity: quantity || 1, // Default to 1 if not provided
      pricePerItem: pricePerItem || totalPrice, // Default to totalPrice if not provided
      totalPrice, // Mandatory field
      firstName: firstName || '', // Optional field
      lastName: lastName || '', // Optional field
      email: email || '', // Optional field
      phone: phone || '', // Optional field
      cardType: isDigital ? 'digital' : 'physical', // Determine card type
      address: isDigital ? null : address, // Store address only for physical cards
    });

    // Save the new coupon to the database
    await newCoupon.save();

    // Send success response with status code 201 (Created)
    return res.status(201).json({
      message: 'Coupon created successfully!',
      coupon: newCoupon,
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error creating coupon:', error);

    // Send failure response with status code 500 (Internal Server Error)
    return res.status(500).json({
      message: 'An error occurred while creating the coupon.',
      error: error.message,
    });
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
  
  

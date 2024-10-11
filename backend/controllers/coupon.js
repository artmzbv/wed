const Coupon = require('../models/coupon');

// Controller for applying a coupon
exports.applyCoupon = async (req, res) => {
  const { couponCode, originalPrice } = req.body;

  try {
    // Find the coupon by code
    const coupon = await Coupon.findOne({ code: couponCode });

    if (!coupon) {
      return res.status(400).json({ message: 'Invalid coupon code' });
    }

    // Check if the coupon has expired
    if (coupon.expirationDate && new Date() > coupon.expirationDate) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }

    // Check if the coupon usage limit is exceeded
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Coupon usage limit exceeded' });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (originalPrice * coupon.discountValue) / 100;
    } else if (coupon.discountType === 'fixed') {
      discountAmount = coupon.discountValue;
    }

    const finalPrice = originalPrice - discountAmount;

    // Update the coupon usage count
    coupon.usedCount += 1;
    await coupon.save();

    // Return the final price after discount
    return res.status(200).json({ finalPrice, discountAmount });

  } catch (error) {
    console.error('Error applying coupon:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

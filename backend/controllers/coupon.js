const Coupon = require('../models/coupon');
const nodemailer = require('nodemailer');
const path = require('path');
const { writeCouponToGoogleSheets } = require('./sheets');

exports.getAllCoupons = async (req, res) => {
    try {
      const coupons = await Coupon.find(); // Get all coupons
      res.status(200).json(coupons); // Send them to the client
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch coupons', error: error.message });
    }
  };

  exports.checkCoupons = async (req, res) => {
    const { code } = req.body;

    try {
      const existingCoupon = await Coupon.findOne({ code });
      if (existingCoupon) {
        return res.json({ isDuplicate: true });
      } else {
        return res.json({ isDuplicate: false });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error checking coupon code uniqueness', error: error.message });
    }
  }  

  
// Create a new coupon (admin use only)
exports.createCoupon = async (req, res) => {
  try {
    // Extract data from request body
    const {
      code,
      discountType,
      discountValue,
      // expirationDate,
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
    // console.log('Received coupon creation data:', req.body);

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
      discountType: discountType,
      discountValue: discountValue || 0, // Default to 0 if not provided
      //expirationDate: expirationDate || null, // Optional field
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

    await writeCouponToGoogleSheets(newCoupon);

    // Send success response with status code 201 (Created)
    res.status(201).json({
      message: 'Coupon created successfully!',
      coupon: newCoupon,
    });

    // Configure the transporter for Gmail using OAuth2
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_ADDRESS, 
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: process.env.GMAIL_ACCESS_TOKEN,
      },
    });
      
        // Email options Shippting adress is an object ${!isDigital ? `<p><strong>Shipping Address:</strong> ${address}</p>` : ''}
    const mailOptions = {
          from: process.env.GMAIL_ADDRESS, // Sender email
          to: email, // Recipient email 
          subject: 'Self-Made Portraits - Reservation Confirmation',
          // before: <li><strong>Discount Type:</strong> ${discountType}</li>
          html: ` 
            <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
              <p>Dear ${firstName} ${lastName},</p>
              <p>Your coupon has been successfully created!</p>
              <p><strong>Coupon Details:</strong></p>
              <ul>
                <li><strong>Code:</strong> ${code}</li>
                <li><strong>Discount Value:</strong> ${discountValue} GBP</li>
                <li><strong>Quantity:</strong> ${quantity}</li>
                <li><strong>Card Type:</strong> ${isDigital ? 'Digital' : 'Physical'}</li>
              </ul>
              <p><strong>Total Price:</strong> ${totalPrice} GBP</p>
            <p style="margin-bottom: 20px;">Thank you for choosing us!</p>
            <p>If you have any questions, feel free to contact us:</p>
                <p><strong>Phone:</strong> +44 1273 011626<br>
                <strong>Email:</strong> info@self-made-portraits.com</p>
                <div style="margin-top: 20px; text-align: left;">
                <img src="cid:logo" alt="Logo" style="width: 150px; height: auto; margin-top: 20px;">
                </div>
            </div>
          `,
          attachments: [
            {
              filename: 'logo.png',
              path: path.join(__dirname, '../utils/logo/logo.png'), // Adjust path as needed
              cid: 'logo', // Content ID for embedding in email
            },
          ],
        };
    // Send the email asynchronously
    await transporter.sendMail(mailOptions)
    .then(() => console.log(`Confirmation email sent to ${email}`))
    .catch((err) => console.error('Error sending confirmation email:', err));
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
      // const finalPrice = originalPrice - discount;
      const discountType = coupon.discountType
      
      res.json({ discount, discountType });
    } catch (error) {
      res.status(500).json({ message: 'Failed to apply coupon' });
    }
  };

// Controller: couponController.js
exports.deleteCoupon = async (req, res) => {
  const { couponCode, couponPath } = req.body; // couponPath может быть 'client' или 'admin'

  try {
    const coupon = await Coupon.findOne({ code: couponCode });
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    // Политика: не удаляем, если купон процентный и запрос от клиента
    if (coupon.discountType === 'percent' && couponPath === 'client') {
      return res.status(200).json({
        message: 'Deletion skipped: client percent coupon must be retained.',
        skipped: true
      });
    }

    await coupon.deleteOne();
    return res.status(200).json({ message: 'Coupon deleted successfully', deleted: true });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete coupon', error: error.message });
  }
};

  

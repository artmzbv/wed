// backend/controllers/stripe.js
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency } = req.body;

    // Create a Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents
      currency, // Currency (e.g., 'usd')
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createPaymentIntent };

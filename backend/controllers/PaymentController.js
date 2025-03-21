const dotenv = require('dotenv');
dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not configured in environment variables');
}

const stripe = require('stripe')(stripeSecretKey);

const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to smallest currency unit
      currency: 'inr',
      payment_method_types: ['card'],
      metadata: {
        userId: req.user?.id,
        integration_check: 'accept_a_payment',
      }
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      amount: amount,
      id: paymentIntent.id
    });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(error.statusCode || 500).json({
      message: error.message || "Payment initialization failed",
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

module.exports = { createPaymentIntent };

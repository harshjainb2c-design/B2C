import type { VercelRequest, VercelResponse } from '@vercel/node';
import Razorpay from 'razorpay';

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST requests are allowed' 
    });
  }

  try {
    // Validate Razorpay credentials
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('[Razorpay] Missing API credentials');
      return res.status(500).json({
        error: 'Configuration error',
        message: 'Razorpay is not configured. Please contact support.',
      });
    }

    const { amount, currency, receipt, notes } = req.body;

    // Validate required fields
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ 
        error: 'Invalid amount',
        message: 'Amount must be a positive number in paise' 
      });
    }

    // Validate amount is reasonable (between ₹1 and ₹10,00,000)
    if (amount < 100 || amount > 100000000) {
      return res.status(400).json({
        error: 'Invalid amount',
        message: 'Amount must be between ₹1 and ₹10,00,000'
      });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount, // Amount in paise
      currency: currency || 'INR',
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {},
    });

    console.log('[Razorpay] Order created successfully:', order.id);
    return res.status(200).json(order);
  } catch (error: any) {
    console.error('[Razorpay] Error creating order:', error);
    return res.status(500).json({
      error: 'Failed to create order',
      message: error.message || 'An unexpected error occurred',
    });
  }
}

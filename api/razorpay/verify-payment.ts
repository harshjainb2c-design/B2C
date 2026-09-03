import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

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
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'Order ID, Payment ID, and Signature are required',
        verified: false,
      });
    }

    // Validate Razorpay secret
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      console.error('[Razorpay] Key secret not configured');
      return res.status(500).json({ 
        error: 'Configuration error',
        message: 'Razorpay is not configured. Please contact support.',
        verified: false,
      });
    }

    // Generate signature for verification
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    // Verify signature using constant-time comparison to prevent timing attacks
    const isValid = crypto.timingSafeEqual(
      Buffer.from(generatedSignature),
      Buffer.from(razorpay_signature)
    );

    if (!isValid) {
      console.warn('[Razorpay] Invalid signature detected:', {
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
      });
      
      return res.status(400).json({
        error: 'Invalid signature',
        message: 'Payment signature verification failed. This transaction may be fraudulent.',
        verified: false,
      });
    }

    console.log('[Razorpay] Payment verified successfully:', razorpay_payment_id);
    
    return res.status(200).json({
      verified: true,
      message: 'Payment verified successfully',
    });
  } catch (error: any) {
    console.error('[Razorpay] Error verifying payment:', error);
    return res.status(500).json({
      error: 'Failed to verify payment',
      message: error.message || 'An unexpected error occurred',
      verified: false,
    });
  }
}

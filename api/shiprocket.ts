import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://mujkpyeennxjkdvezpaz.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const mapOrderStatus = (status: string): 'processing' | 'shipped' | 'delivered' | 'cancelled' => {
  const normalized = status.toLowerCase();
  if (normalized.includes('deliver')) return 'delivered';
  if (normalized.includes('cancel') || normalized.includes('rto')) return 'cancelled';
  if (normalized.includes('ship') || normalized.includes('transit')) return 'shipped';
  return 'processing';
};

import { checkShiprocketServiceability, trackShiprocketShipment, generateShiprocketAWB } from './_lib/shiprocket';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { action } = req.query;

  if (req.method === 'GET' && action === 'serviceability') {
    const pincode = String(req.query.pincode || '');
    if (!pincode || pincode.length !== 6) {
      return res.status(400).json({ error: { code: 'INVALID_PINCODE', message: 'Valid 6-digit pincode required' } });
    }
    const cod = req.query.cod !== '0';
    const weight = Number(req.query.weight) || 0.5;
    try {
      const data = await checkShiprocketServiceability(pincode, cod, weight);
      return res.status(200).json(data);
    } catch (err: any) {
      return res.status(500).json({ error: { code: 'SERVICEABILITY_ERROR', message: err.message } });
    }
  }

  if (req.method === 'GET' && action === 'track') {
    const shipmentId = String(req.query.shipment_id || '');
    if (!shipmentId) {
      return res.status(400).json({ error: { code: 'MISSING_SHIPMENT_ID', message: 'Shipment ID required' } });
    }
    try {
      const data = await trackShiprocketShipment(shipmentId);
      return res.status(200).json(data);
    } catch (err: any) {
      return res.status(500).json({ error: { code: 'TRACKING_ERROR', message: err.message } });
    }
  }

  if (req.method === 'POST' && action === 'generate-awb') {
    const shipmentId = String(req.body?.shipment_id || '');
    const courierId = req.body?.courier_id ? Number(req.body.courier_id) : undefined;
    if (!shipmentId) {
      return res.status(400).json({ error: { code: 'MISSING_SHIPMENT_ID', message: 'Shipment ID required' } });
    }
    try {
      const result = await generateShiprocketAWB(shipmentId, courierId);
      if (result.response?.data?.awb_code) {
        await supabase.from('orders').update({
          awb_code: result.response.data.awb_code,
          courier_name: result.response.data.courier_name,
          tracking_status: 'AWB Assigned',
          updated_at: new Date().toISOString(),
        }).eq('shiprocket_shipment_id', shipmentId);
      }
      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(500).json({ error: { code: 'AWB_ERROR', message: err.message } });
    }
  }

  if (req.method === 'POST' && action === 'webhook') {
    const configuredSecret = process.env.SHIPROCKET_WEBHOOK_SECRET;
    const suppliedSecret = req.headers['x-shiprocket-webhook-secret'] || req.query.secret;
    if (!configuredSecret || suppliedSecret !== configuredSecret) {
      return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid webhook secret' }, status: 401 });
    }

    const shipmentId = String(req.body?.shipment_id || '');
    const currentStatus = String(req.body?.current_status || req.body?.shipment_status || '');
    if (!shipmentId || !currentStatus) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Shipment ID and current status are required' }, status: 400 });
    }

    const { error } = await supabase.from('orders').update({
      status: mapOrderStatus(currentStatus),
      fulfillment_status: currentStatus.toLowerCase(),
      tracking_status: currentStatus,
      awb_code: req.body?.awb_code ? String(req.body.awb_code) : undefined,
      courier_name: req.body?.courier_name ? String(req.body.courier_name) : undefined,
      updated_at: new Date().toISOString(),
    }).eq('shiprocket_shipment_id', shipmentId);

    if (error) {
      console.error('Shiprocket webhook update error:', error);
      return res.status(500).json({ error: { code: 'DATABASE_ERROR', message: 'Unable to update shipment status' }, status: 500 });
    }

    return res.status(200).json({ received: true });
  }

  return res.status(405).json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' }, status: 405 });
}

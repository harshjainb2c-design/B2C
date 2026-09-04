import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const mapOrderStatus = (status: string): 'processing' | 'shipped' | 'delivered' | 'cancelled' => {
  const normalized = status.toLowerCase();
  if (normalized.includes('deliver')) return 'delivered';
  if (normalized.includes('cancel') || normalized.includes('rto')) return 'cancelled';
  if (normalized.includes('ship') || normalized.includes('transit')) return 'shipped';
  return 'processing';
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST' || req.query.action !== 'webhook') {
    return res.status(405).json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' }, status: 405 });
  }

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

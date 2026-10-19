import { getShiprocketConfig } from './settings';

const SHIPROCKET_BASE_URL = 'https://apiv2.shiprocket.in/v1/external';

interface ShiprocketAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface ShiprocketOrderItem {
  name: string;
  sku: string;
  quantity: number;
  sellingPrice: number;
}

export interface CreateShiprocketOrderInput {
  orderId: string;
  customerEmail?: string;
  shippingAddress: ShiprocketAddress;
  items: ShiprocketOrderItem[];
  total: number;
  paymentMethod?: 'COD' | 'Prepaid';
}

export interface ShiprocketShipment {
  orderId: string;
  shipmentId: string;
}

export class ShiprocketError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ShiprocketError';
  }
}

let cachedToken: { value: string; expiresAt: number } | null = null;

const parsePositiveEnvNumber = (name: string, fallback: number): number => {
  const value = Number(process.env[name] || fallback);
  if (!Number.isFinite(value) || value <= 0) {
    return fallback;
  }
  return value;
};

const readResponse = async (response: Response) => {
  const body = await response.text();
  try {
    return body ? JSON.parse(body) : {};
  } catch {
    return { message: body };
  }
};

const getToken = async (): Promise<string> => {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.value;
  }

  const config = await getShiprocketConfig();
  if (!config.email || !config.password) {
    throw new ShiprocketError('Missing Shiprocket credentials');
  }

  const response = await fetch(`${SHIPROCKET_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: config.email,
      password: config.password,
    }),
  });
  const data = await readResponse(response);

  if (!response.ok || typeof data.token !== 'string') {
    throw new ShiprocketError(data.message || 'Shiprocket authentication failed');
  }

  cachedToken = {
    value: data.token,
    expiresAt: Date.now() + 9 * 24 * 60 * 60 * 1000,
  };

  return cachedToken.value;
};

const splitName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] || 'Customer';
  const lastName = parts.slice(1).join(' ') || '.';
  return { firstName, lastName };
};

export const createShiprocketCodShipment = async (
  input: CreateShiprocketOrderInput
): Promise<ShiprocketShipment> => {
  const config = await getShiprocketConfig();
  const token = await getToken();
  const { firstName, lastName } = splitName(input.shippingAddress.fullName);
  const paymentMethod = input.paymentMethod || 'COD';
  const cleanPhone = input.shippingAddress.phone.replace(/\D/g, '').slice(-10) || '9999999999';
  const cleanEmail = (input.customerEmail && input.customerEmail.includes('@')) 
    ? input.customerEmail 
    : (config.email || 'support@b2cexports.com');

  const response = await fetch(`${SHIPROCKET_BASE_URL}/orders/create/adhoc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      order_id: input.orderId,
      order_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
      pickup_location: config.pickupLocation || 'work',
      billing_customer_name: firstName,
      billing_last_name: lastName,
      billing_address: input.shippingAddress.addressLine1,
      billing_address_2: input.shippingAddress.addressLine2 || '',
      billing_city: input.shippingAddress.city,
      billing_pincode: input.shippingAddress.postalCode.replace(/\s+/g, ''),
      billing_state: input.shippingAddress.state,
      billing_country: input.shippingAddress.country || 'India',
      billing_email: cleanEmail,
      billing_phone: cleanPhone,
      shipping_is_billing: true,
      order_items: input.items.map((item) => ({
        name: item.name,
        sku: item.sku || 'SKU-DEFAULT',
        units: Math.max(1, Number(item.quantity) || 1),
        selling_price: Math.max(1, Number(item.sellingPrice) || 1),
        discount: '',
        tax: '',
        hsn: '',
      })),
      payment_method: paymentMethod,
      sub_total: Math.max(1, Number(input.total) || 1),
      length: parsePositiveEnvNumber('SHIPROCKET_DEFAULT_LENGTH_CM', 10),
      breadth: parsePositiveEnvNumber('SHIPROCKET_DEFAULT_BREADTH_CM', 10),
      height: parsePositiveEnvNumber('SHIPROCKET_DEFAULT_HEIGHT_CM', 10),
      weight: parsePositiveEnvNumber('SHIPROCKET_DEFAULT_WEIGHT_KG', 0.5),
    }),
  });
  const data = await readResponse(response);

  if (!response.ok || !data.shipment_id || !data.order_id) {
    const errorMsg = typeof data.errors === 'object' 
      ? JSON.stringify(data.errors) 
      : (data.message || 'Shiprocket could not create shipment');
    throw new ShiprocketError(errorMsg);
  }

  return {
    orderId: String(data.order_id),
    shipmentId: String(data.shipment_id),
  };
};

export const checkShiprocketServiceability = async (
  deliveryPostcode: string,
  cod: boolean = true,
  weight: number = 0.5
) => {
  const token = await getToken();
  const pickupPostcode = '452003';
  const url = `${SHIPROCKET_BASE_URL}/courier/serviceability/?pickup_postcode=${pickupPostcode}&delivery_postcode=${deliveryPostcode.replace(/\s+/g, '')}&cod=${cod ? 1 : 0}&weight=${weight}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await readResponse(response);
  return data;
};

export const trackShiprocketShipment = async (shipmentId: string) => {
  const token = await getToken();
  const response = await fetch(`${SHIPROCKET_BASE_URL}/courier/track/shipment/${shipmentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await readResponse(response);
};

export const generateShiprocketAWB = async (shipmentId: string, courierId?: number) => {
  const token = await getToken();
  const body: Record<string, any> = { shipment_id: shipmentId };
  if (courierId) body.courier_id = courierId;

  const response = await fetch(`${SHIPROCKET_BASE_URL}/courier/assign/awb`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  return await readResponse(response);
};

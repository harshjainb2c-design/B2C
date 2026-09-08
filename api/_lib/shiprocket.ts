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
  const [firstName, ...lastName] = fullName.trim().split(/\s+/);
  return { firstName: firstName || 'Customer', lastName: lastName.join(' ') || 'Customer' };
};

export const createShiprocketCodShipment = async (
  input: CreateShiprocketOrderInput
): Promise<ShiprocketShipment> => {
  const config = await getShiprocketConfig();
  const token = await getToken();
  const { firstName, lastName } = splitName(input.shippingAddress.fullName);
  const paymentMethod = input.paymentMethod || 'COD';

  const response = await fetch(`${SHIPROCKET_BASE_URL}/orders/create/adhoc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      order_id: input.orderId,
      order_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
      pickup_location: config.pickupLocation || 'Primary',
      billing_customer_name: firstName,
      billing_last_name: lastName,
      billing_address: input.shippingAddress.addressLine1,
      billing_address_2: input.shippingAddress.addressLine2 || '',
      billing_city: input.shippingAddress.city,
      billing_pincode: input.shippingAddress.postalCode,
      billing_state: input.shippingAddress.state,
      billing_country: input.shippingAddress.country,
      billing_email: input.customerEmail || '',
      billing_phone: input.shippingAddress.phone,
      shipping_is_billing: true,
      order_items: input.items.map((item) => ({
        name: item.name,
        sku: item.sku,
        units: item.quantity,
        selling_price: item.sellingPrice,
        discount: '',
        tax: '',
        hsn: '',
      })),
      payment_method: paymentMethod,
      sub_total: input.total,
      length: parsePositiveEnvNumber('SHIPROCKET_DEFAULT_LENGTH_CM', 10),
      breadth: parsePositiveEnvNumber('SHIPROCKET_DEFAULT_BREADTH_CM', 10),
      height: parsePositiveEnvNumber('SHIPROCKET_DEFAULT_HEIGHT_CM', 10),
      weight: parsePositiveEnvNumber('SHIPROCKET_DEFAULT_WEIGHT_KG', 0.5),
    }),
  });
  const data = await readResponse(response);

  if (!response.ok || !data.shipment_id || !data.order_id) {
    throw new ShiprocketError(data.message || 'Shiprocket could not create the shipment');
  }

  return {
    orderId: String(data.order_id),
    shipmentId: String(data.shipment_id),
  };
};

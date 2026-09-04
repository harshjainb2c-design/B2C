import { CartItem } from './cart';

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export type PaymentMethod = 'cod';
export type PaymentStatus = 'pending_collection' | 'collected';
export type FulfillmentStatus =
  | 'pending'
  | 'shipment_created'
  | 'failed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  shiprocketOrderId?: string;
  shiprocketShipmentId?: string;
  awbCode?: string;
  courierName?: string;
  trackingStatus?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderListResponse {
  orders: Order[];
  total: number;
}

export interface CreateOrderRequest {
  items: Array<Pick<CartItem, 'productId' | 'quantity' | 'size'>>;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
}

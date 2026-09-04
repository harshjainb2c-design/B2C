-- Apply this in the Supabase SQL editor before enabling Shiprocket checkout.
-- It keeps the legacy payment_intent_id column for existing rows but makes it
-- optional because COD orders do not have a payment-gateway reference.

alter table public.orders
  alter column payment_intent_id drop not null;

alter table public.orders
  add column if not exists payment_method text not null default 'cod',
  add column if not exists payment_status text not null default 'pending_collection',
  add column if not exists fulfillment_status text not null default 'pending',
  add column if not exists shiprocket_order_id text,
  add column if not exists shiprocket_shipment_id text,
  add column if not exists awb_code text,
  add column if not exists courier_name text,
  add column if not exists tracking_status text;

create unique index if not exists orders_shiprocket_shipment_id_key
  on public.orders (shiprocket_shipment_id)
  where shiprocket_shipment_id is not null;

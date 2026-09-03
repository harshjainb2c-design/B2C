import { z } from 'zod';

/**
 * Validation schema for shipping address (India)
 */
const shippingAddressSchemaBase = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  addressLine1: z.string().min(5, 'Address must be at least 5 characters'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  postalCode: z.string().regex(/^\d{6}$/, 'Invalid PIN code format (must be 6 digits, e.g., 400001)'),
  country: z.string(),
  phone: z.string().regex(/^(\+91[\s\-]?)?[6-9]\d{9}$/, 'Invalid Indian phone number (e.g., +91 98765 43210)'),
});

export const shippingAddressSchema = shippingAddressSchemaBase.transform((data) => ({
  ...data,
  country: data.country || 'India',
}));

/**
 * Validation schema for checkout
 */
export const checkoutSchema = z.object({
  shippingAddress: shippingAddressSchema,
  items: z.array(
    z.object({
      productId: z.string().uuid('Invalid product ID'),
      quantity: z.number().int().positive('Quantity must be a positive integer'),
    })
  ).min(1, 'Cart must contain at least one item'),
});

export type ShippingAddressInput = z.infer<typeof shippingAddressSchemaBase>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;

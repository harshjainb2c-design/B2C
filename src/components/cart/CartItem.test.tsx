import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import { CartItem } from './CartItem';
import { CartItem as CartItemType } from '../../types/cart';
import { Product } from '../../types/product';

describe('CartItem', () => {
  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    description: 'Test Description',
    price: 29.99,
    category: 'electronics',
    images: ['https://example.com/image.jpg'],
    stock: 10,
    isActive: true,
    specifications: {},
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  const mockCartItem: CartItemType = {
    productId: '1',
    product: mockProduct,
    quantity: 2,
    price: 29.99,
  };

  const mockOnUpdateQuantity = vi.fn();
  const mockOnRemove = vi.fn();

  beforeEach(() => {
    mockOnUpdateQuantity.mockClear();
    mockOnRemove.mockClear();
  });

  it('should render product information', () => {
    render(
      <CartItem
        item={mockCartItem}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$29.99 each')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should display item total price', () => {
    render(
      <CartItem
        item={mockCartItem}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemove={mockOnRemove}
      />
    );

    // 2 * $29.99 = $59.98
    expect(screen.getByText('$59.98')).toBeInTheDocument();
  });

  it('should call onUpdateQuantity when increment button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <CartItem
        item={mockCartItem}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemove={mockOnRemove}
      />
    );

    const incrementButton = screen.getByLabelText('Increase quantity');
    await user.click(incrementButton);

    expect(mockOnUpdateQuantity).toHaveBeenCalledWith('1', 3);
  });

  it('should call onUpdateQuantity when decrement button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <CartItem
        item={mockCartItem}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemove={mockOnRemove}
      />
    );

    const decrementButton = screen.getByLabelText('Decrease quantity');
    await user.click(decrementButton);

    expect(mockOnUpdateQuantity).toHaveBeenCalledWith('1', 1);
  });

  it('should disable decrement button when quantity is 1', () => {
    const itemWithQuantity1 = { ...mockCartItem, quantity: 1 };
    
    render(
      <CartItem
        item={itemWithQuantity1}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemove={mockOnRemove}
      />
    );

    const decrementButton = screen.getByLabelText('Decrease quantity');
    expect(decrementButton).toBeDisabled();
  });

  it('should disable increment button when quantity equals stock', () => {
    const itemAtMaxStock = { ...mockCartItem, quantity: 10 };
    
    render(
      <CartItem
        item={itemAtMaxStock}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemove={mockOnRemove}
      />
    );

    const incrementButton = screen.getByLabelText('Increase quantity');
    expect(incrementButton).toBeDisabled();
  });

  it('should call onRemove when remove button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <CartItem
        item={mockCartItem}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemove={mockOnRemove}
      />
    );

    const removeButton = screen.getByLabelText('Remove item');
    await user.click(removeButton);

    expect(mockOnRemove).toHaveBeenCalledWith('1');
  });

  it('should show low stock warning when stock is 10 or less', () => {
    const lowStockProduct = { ...mockProduct, stock: 5 };
    const lowStockItem = { ...mockCartItem, product: lowStockProduct };
    
    render(
      <CartItem
        item={lowStockItem}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByText('Only 5 available')).toBeInTheDocument();
  });

  it('should not show low stock warning when stock is above 10', () => {
    const highStockProduct = { ...mockProduct, stock: 50 };
    const highStockItem = { ...mockCartItem, product: highStockProduct };
    
    render(
      <CartItem
        item={highStockItem}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.queryByText(/Only \d+ available/)).not.toBeInTheDocument();
  });

  it('should display product image when available', () => {
    render(
      <CartItem
        item={mockCartItem}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemove={mockOnRemove}
      />
    );

    const image = screen.getByAltText('Test Product');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('should show placeholder when no image is available', () => {
    const noImageProduct = { ...mockProduct, images: [] };
    const noImageItem = { ...mockCartItem, product: noImageProduct };
    
    render(
      <CartItem
        item={noImageItem}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByText('No Image')).toBeInTheDocument();
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import { ProductFilters, ProductFiltersState } from './ProductFilters';

describe('ProductFilters', () => {
  const mockOnFiltersChange = vi.fn();

  beforeEach(() => {
    mockOnFiltersChange.mockClear();
  });

  it('should render all filter sections', () => {
    render(
      <ProductFilters
        filters={{}}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    expect(screen.getByText('FILTERS')).toBeInTheDocument();
    expect(screen.getByText('PRICE RANGE')).toBeInTheDocument();
    expect(screen.getByText('GENDER')).toBeInTheDocument();
    expect(screen.getByText('CLOTHING TYPE')).toBeInTheDocument();
    expect(screen.getByText('ITEM TYPE')).toBeInTheDocument();
  });

  it('should render price range options', () => {
    render(
      <ProductFilters
        filters={{}}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    expect(screen.getByText('Under $25')).toBeInTheDocument();
    expect(screen.getByText('$25 - $50')).toBeInTheDocument();
    expect(screen.getByText('$50 - $100')).toBeInTheDocument();
  });

  it('should call onFiltersChange when a filter is selected', async () => {
    const user = userEvent.setup();
    
    render(
      <ProductFilters
        filters={{}}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    const menCheckbox = screen.getByLabelText('Men');
    await user.click(menCheckbox);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({ gender: 'men' });
  });

  it('should show selected filters as checked', () => {
    const filters: ProductFiltersState = {
      gender: 'women',
      priceRange: '25-50',
    };

    render(
      <ProductFilters
        filters={filters}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    const womenCheckbox = screen.getByLabelText('Women') as HTMLInputElement;
    const priceCheckbox = screen.getByLabelText('$25 - $50') as HTMLInputElement;
    
    expect(womenCheckbox.checked).toBe(true);
    expect(priceCheckbox.checked).toBe(true);
  });

  it('should show clear all button when filters are active', () => {
    const filters: ProductFiltersState = {
      gender: 'men',
    };

    render(
      <ProductFilters
        filters={filters}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    expect(screen.getByText('Clear All Filters')).toBeInTheDocument();
  });

  it('should not show clear all button when no filters are active', () => {
    render(
      <ProductFilters
        filters={{}}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    expect(screen.queryByText('Clear All Filters')).not.toBeInTheDocument();
  });

  it('should call onFiltersChange with empty object when clear all is clicked', async () => {
    const user = userEvent.setup();
    const filters: ProductFiltersState = {
      gender: 'men',
      priceRange: '25-50',
    };
    
    render(
      <ProductFilters
        filters={filters}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    const clearButton = screen.getByText('Clear All Filters');
    await user.click(clearButton);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({});
  });

  it('should uncheck filter when clicked again', async () => {
    const user = userEvent.setup();
    const filters: ProductFiltersState = {
      gender: 'men',
    };
    
    render(
      <ProductFilters
        filters={filters}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    const menCheckbox = screen.getByLabelText('Men');
    await user.click(menCheckbox);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({ gender: undefined });
  });
});

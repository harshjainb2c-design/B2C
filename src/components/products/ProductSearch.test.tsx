import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import { ProductSearch } from './ProductSearch';

describe('ProductSearch', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  it('should render search input with placeholder', () => {
    render(<ProductSearch onSearch={mockOnSearch} />);

    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
  });

  it('should render custom placeholder', () => {
    render(
      <ProductSearch
        onSearch={mockOnSearch}
        placeholder="Find your product"
      />
    );

    expect(screen.getByPlaceholderText('Find your product')).toBeInTheDocument();
  });

  it('should call onSearch after debounce delay', async () => {
    const user = userEvent.setup();
    
    render(<ProductSearch onSearch={mockOnSearch} debounceMs={100} />);

    const input = screen.getByPlaceholderText('Search products...');
    await user.type(input, 'laptop');

    // Wait for debounce
    await waitFor(
      () => {
        expect(mockOnSearch).toHaveBeenCalledWith('laptop');
      },
      { timeout: 500 }
    );
  });

  it('should show clear button when there is text', async () => {
    const user = userEvent.setup();
    
    render(<ProductSearch onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('Search products...');
    
    // Initially no clear button
    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    await user.type(input, 'test');

    // Clear button should appear
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should clear search when clear button is clicked', async () => {
    const user = userEvent.setup();
    
    render(<ProductSearch onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('Search products...') as HTMLInputElement;
    await user.type(input, 'test');

    expect(input.value).toBe('test');

    const clearButton = screen.getByRole('button');
    await user.click(clearButton);

    expect(input.value).toBe('');
  });

  it('should call onSearch with empty string when cleared', async () => {
    const user = userEvent.setup();
    
    render(<ProductSearch onSearch={mockOnSearch} debounceMs={100} />);

    const input = screen.getByPlaceholderText('Search products...');
    await user.type(input, 'test');

    await waitFor(
      () => {
        expect(mockOnSearch).toHaveBeenCalledWith('test');
      },
      { timeout: 500 }
    );

    mockOnSearch.mockClear();

    const clearButton = screen.getByRole('button');
    await user.click(clearButton);

    await waitFor(
      () => {
        expect(mockOnSearch).toHaveBeenCalledWith('');
      },
      { timeout: 500 }
    );
  });
});

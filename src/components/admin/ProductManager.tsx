import { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useCreateProduct, useUpdateProduct, useDeleteProduct } from '../../hooks/useAdminProducts';
import { Product } from '../../types/product';
import { ProductForm } from './ProductForm';
import { Edit, Plus, Eye, EyeOff, Search, Filter, Package, Trash2 } from 'lucide-react';

export const ProductManager = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageLimit = 12;

  const { data, isLoading, error } = useProducts({
    search: searchTerm,
    category: categoryFilter,
    includeInactive: true,
    page: currentPage,
    limit: pageLimit,
  });

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const handleCreateProduct = async (formData: any) => {
    try {
      await createProduct.mutateAsync(formData);
      setShowForm(false);
      alert('Product created successfully!');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to create product');
    }
  };

  const handleUpdateProduct = async (formData: any) => {
    if (!editingProduct) return;

    try {
      await updateProduct.mutateAsync({
        id: editingProduct.id,
        ...formData,
      });
      setEditingProduct(null);
      setShowForm(false);
      alert('Product updated successfully!');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update product');
    }
  };

  const handleToggleActive = async (product: Product) => {
    const action = product.isActive ? 'deactivate' : 'activate';
    const confirmed = window.confirm(
      `Are you sure you want to ${action} "${product.name}"?`
    );

    if (!confirmed) return;

    try {
      await updateProduct.mutateAsync({
        id: product.id,
        isActive: !product.isActive,
      });
      alert(`Product ${action}d successfully!`);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update product status');
    }
  };

  const handleDelete = async (product: Product) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${product.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await deleteProduct.mutateAsync(product.id);
      alert('Product deleted successfully!');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const categories = Array.from(
    new Set(data?.products.map((p) => p.category) || [])
  );

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-warmBrown to-taupe px-5 py-5 sm:px-8 sm:py-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                {editingProduct ? 'Edit Product' : 'Create New Product'}
              </h2>
              <p className="text-sm sm:text-base text-cream mt-1">
                {editingProduct ? 'Update product information' : 'Add a new product to your inventory'}
              </p>
            </div>
            <div className="p-5 sm:p-6 lg:p-8">
              <ProductForm
                product={editingProduct || undefined}
                onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
                onCancel={handleCancel}
                isLoading={createProduct.isPending || updateProduct.isPending}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Product Management</h2>
            <p className="text-base sm:text-lg text-gray-600">Manage your product inventory and catalog</p>
          </div>
          <button
            onClick={handleNewProduct}
            className="flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 text-sm font-semibold bg-gradient-to-r from-terracotta to-warmBrown text-white rounded-xl hover:from-warmBrown hover:to-taupe shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 self-start sm:self-auto"
          >
            <Plus className="h-5 w-5" />
            <span>Add Product</span>
          </button>
        </div>

        {/* Filters Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label htmlFor="search" className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                <Search className="h-4 w-4 text-gray-500" />
                Search Products
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by name..."
                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 px-3 py-2.5 sm:px-4 sm:py-3 border transition-all text-sm sm:text-base"
              />
            </div>

            <div>
              <label htmlFor="category" className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                <Filter className="h-4 w-4 text-gray-500" />
                Filter by Category
              </label>
              <select
                id="category"
                value={categoryFilter}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 px-3 py-2.5 sm:px-4 sm:py-3 border transition-all text-sm sm:text-base"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {isLoading && (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
              <p className="mt-6 text-lg font-medium text-gray-600">Loading products...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <div className="bg-red-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Package className="h-8 w-8 text-red-600" />
              </div>
              <p className="text-red-600 font-medium">Error loading products</p>
              <p className="text-sm text-gray-600 mt-1">{error.message}</p>
            </div>
          )}

          {data && data.products.length === 0 && (
            <div className="text-center py-20">
              <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium text-lg">No products found</p>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
            </div>
          )}

          {data && data.products.length > 0 && (
            <>
              {/* Mobile Card View */}
              <div className="block lg:hidden p-4 space-y-4">
                {data.products.map((product) => (
                  <div key={product.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex gap-4 mb-3">
                      <img
                        className="h-20 w-20 rounded-lg object-cover shadow-sm border border-gray-200"
                        src={product.images[0]}
                        alt={product.name}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-gray-900 truncate">{product.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">ID: {product.id.slice(0, 8)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-2 py-0.5 text-xs font-semibold text-purple-700 bg-purple-50 rounded-full border border-purple-200">
                            {product.category}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                              product.isActive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-gray-100 text-gray-600 border border-gray-200'
                            }`}
                          >
                            {product.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Price</p>
                        <p className="text-base font-bold text-gray-900">₹{product.price.toFixed(0)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Stock</p>
                        <p className={`text-base font-bold ${product.stock < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                          {product.stock}
                          {product.stock < 10 && <span className="text-xs ml-1">(Low)</span>}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleActive(product)}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                          product.isActive
                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        }`}
                      >
                        {product.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 py-2 px-3 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 text-xs font-semibold transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="py-2 px-3 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-xs font-semibold transition-all"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {data.products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-14 w-14 flex-shrink-0">
                              <img
                                className="h-14 w-14 rounded-xl object-cover shadow-sm border border-gray-200"
                                src={product.images[0]}
                                alt={product.name}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900">
                                {product.name}
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5">
                                ID: {product.id.slice(0, 8)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-50 rounded-full border border-purple-200">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">₹{product.price.toFixed(0)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-semibold ${product.stock < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                            {product.stock}
                            {product.stock < 10 && <span className="text-xs ml-1">(Low)</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 text-xs font-bold rounded-full ${
                              product.isActive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-gray-100 text-gray-600 border border-gray-200'
                            }`}
                          >
                            {product.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleToggleActive(product)}
                              className={`p-2 rounded-lg transition-all ${
                                product.isActive
                                  ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                  : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                              }`}
                              title={product.isActive ? 'Deactivate' : 'Activate'}
                            >
                              {product.isActive ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-all"
                              title="Edit"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(product)}
                              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                              title="Delete"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-gray-50 px-4 sm:px-6 py-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs sm:text-sm text-gray-600">
                    Showing <span className="font-semibold text-gray-900">{data.products.length}</span> of{' '}
                    <span className="font-semibold text-gray-900">{data.total}</span> products
                  </p>
                  
                  {data.totalPages > 1 && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Previous
                      </button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                          let pageNum;
                          if (data.totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= data.totalPages - 2) {
                            pageNum = data.totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                                currentPage === pageNum
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-white border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                      
                      <button
                        onClick={() => setCurrentPage(Math.min(data.totalPages, currentPage + 1))}
                        disabled={currentPage === data.totalPages}
                        className="px-3 py-1.5 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

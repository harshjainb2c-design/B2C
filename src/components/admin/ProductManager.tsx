import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useCreateProduct, useUpdateProduct, useDeleteProduct } from '../../hooks/useAdminProducts';
import { Product } from '../../types/product';
import { ProductForm } from './ProductForm';
import { Plus, Search, Filter, Trash2, ArrowLeft } from 'lucide-react';

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
      alert('Product created successfully');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create product');
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
      alert('Product updated successfully');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update product');
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
      alert(`Product ${action}d successfully`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const handleDelete = async (product: Product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) return;

    try {
      await deleteProduct.mutateAsync(product.id);
      alert('Product deleted successfully');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete product');
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
      <div className="min-h-screen bg-black text-white p-4 sm:p-6 lg:p-8 font-inter select-none">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-5">
            <button
              type="button"
              onClick={handleCancel}
              className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-neutral-400 bg-neutral-900 active:bg-neutral-800"
              aria-label="Back to Catalog"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
                CATALOG EDITOR
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white uppercase tracking-tight">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h1>
            </div>
          </div>

          <div className="bg-neutral-950 border border-white/10 rounded-2xl p-5 sm:p-7">
            <ProductForm
              product={editingProduct || undefined}
              onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
              onCancel={handleCancel}
              isLoading={createProduct.isPending || updateProduct.isPending}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 lg:p-8 font-inter select-none">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-neutral-400 bg-neutral-900 active:bg-neutral-800"
              aria-label="Back to Admin"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
                INVENTORY CONTROL
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white uppercase tracking-tight">
                PRODUCT CATALOG
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={handleNewProduct}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-white active:bg-neutral-200 transition-colors self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </button>
        </div>

        <div className="bg-neutral-950 border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                <Search className="h-3.5 w-3.5 text-neutral-400" />
                <span>Search Products</span>
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by title..."
                className="w-full rounded-xl bg-black border border-white/15 text-white text-xs px-4 py-2.5 outline-none focus:border-white transition-colors placeholder:text-neutral-600"
              />
            </div>

            <div>
              <label htmlFor="category" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                <Filter className="h-3.5 w-3.5 text-neutral-400" />
                <span>Category Filter</span>
              </label>
              <select
                id="category"
                value={categoryFilter}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full rounded-xl bg-black border border-white/15 text-white text-xs px-4 py-2.5 outline-none focus:border-white transition-colors"
              >
                <option value="" className="bg-black text-white">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-black text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-neutral-950 border border-white/10 rounded-2xl overflow-hidden">
          {isLoading && (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-white border-t-transparent mx-auto"></div>
              <p className="mt-4 text-xs font-bold uppercase tracking-wider text-neutral-400">Loading catalog...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-16">
              <p className="text-sm font-bold text-white uppercase">Error loading products</p>
              <p className="text-xs text-neutral-400 mt-1">{error.message}</p>
            </div>
          )}

          {data && data.products.length === 0 && (
            <div className="text-center py-16">
              <p className="text-sm font-bold text-white uppercase">No products match your criteria</p>
              <p className="text-xs text-neutral-500 mt-1">Try resetting search or category filter</p>
            </div>
          )}

          {data && data.products.length > 0 && (
            <>
              <div className="block lg:hidden p-4 space-y-3">
                {data.products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-black border border-white/10 rounded-xl p-4 space-y-3"
                  >
                    <div className="flex gap-3">
                      <img
                        className="h-16 w-16 rounded-lg object-cover bg-neutral-900 border border-white/10 shrink-0"
                        src={product.images[0]}
                        alt={product.name}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-white truncate">{product.name}</h3>
                        <p className="text-[10px] text-neutral-500 font-mono mt-0.5">ID: {product.id.slice(0, 8)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-neutral-900 border border-white/10 text-neutral-300">
                            {product.category}
                          </span>
                          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                            product.isActive ? 'bg-white text-black' : 'border border-white/20 text-neutral-400'
                          }`}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs border-t border-white/5 pt-2">
                      <div>
                        <p className="text-[10px] text-neutral-500 uppercase font-bold">Price</p>
                        <p className="font-extrabold text-white">₹{product.price.toFixed(0)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-neutral-500 uppercase font-bold">Stock</p>
                        <p className="font-extrabold text-white">{product.stock} units</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(product)}
                        className="flex-1 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-neutral-900 border border-white/15 text-white active:bg-neutral-800 transition-colors"
                      >
                        {product.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEdit(product)}
                        className="flex-1 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-white text-black active:bg-neutral-200 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product)}
                        className="p-2 rounded-lg bg-neutral-900 border border-white/15 text-neutral-400 active:text-white"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10 text-left">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-neutral-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {data.products.map((product) => (
                      <tr key={product.id} className="active:bg-neutral-900/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <img
                              className="h-12 w-12 rounded-xl object-cover bg-neutral-900 border border-white/10 shrink-0"
                              src={product.images[0]}
                              alt={product.name}
                            />
                            <div>
                              <p className="text-sm font-bold text-white">{product.name}</p>
                              <p className="text-[10px] text-neutral-500 font-mono mt-0.5">ID: {product.id.slice(0, 8)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 text-[11px] font-bold uppercase rounded-full bg-neutral-900 border border-white/10 text-neutral-300">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-extrabold text-white">
                          ₹{product.price.toFixed(0)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-neutral-300">
                          {product.stock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                            product.isActive ? 'bg-white text-black' : 'border border-white/20 text-neutral-400'
                          }`}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleToggleActive(product)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-neutral-900 border border-white/15 text-white active:bg-neutral-800 transition-colors"
                            >
                              {product.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEdit(product)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-white text-black active:bg-neutral-200 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(product)}
                              className="p-1.5 rounded-lg bg-neutral-900 border border-white/15 text-neutral-400 active:text-white"
                              aria-label="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

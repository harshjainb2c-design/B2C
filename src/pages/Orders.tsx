import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ArrowLeft, Filter } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import { OrderList } from '../components/orders/OrderList';
import { OrderDetail } from '../components/orders/OrderDetail';
import { OrderStatus } from '../types/order';
import { useAuthStore } from '../stores/authStore';

export const Orders = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { data, isLoading, error } = useOrders();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleOrderClick = (orderId: string) => {
    setSelectedOrderId(orderId);
  };

  const handleCloseDetail = () => {
    setSelectedOrderId(null);
  };

  const handleBackToProducts = () => {
    navigate('/products');
  };

  const filteredOrders = data?.orders?.filter((order) => {
    if (statusFilter === 'all') return true;
    return order.status === statusFilter;
  }) || [];

  const selectedOrder = selectedOrderId
    ? data?.orders.find((order) => order.id === selectedOrderId)
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-white border-t-transparent mx-auto mb-4" />
              <p className="text-xs font-mono uppercase tracking-wider text-neutral-400">Loading your orders...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-neutral-800 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <Package className="w-16 h-16 text-neutral-600 mb-6" />
              <h1 className="text-2xl font-bold uppercase tracking-wider text-white mb-3">
                Error Loading Orders
              </h1>
              <p className="text-sm text-neutral-400 mb-8 max-w-md">
                We couldn't load your orders. Please try again later.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 text-xs font-bold uppercase tracking-widest text-black bg-white hover:bg-neutral-200 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data?.orders || data.orders.length === 0) {
    return (
      <div className="min-h-screen bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-neutral-800 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <Package className="w-16 h-16 text-neutral-700 mb-6" />
              <h1 className="text-2xl font-bold uppercase tracking-wider text-white mb-3">
                No Orders Yet
              </h1>
              <p className="text-sm text-neutral-400 mb-8 max-w-md">
                You haven't placed any orders yet. Explore our latest drops and begin your collection.
              </p>
              <button
                onClick={handleBackToProducts}
                className="px-8 py-3 text-xs font-bold uppercase tracking-widest text-black bg-white hover:bg-neutral-200 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Start Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 pb-6 border-b border-neutral-800">
          <button
            onClick={handleBackToProducts}
            className="flex items-center gap-2 text-neutral-400 hover:text-white mb-4 text-xs font-mono uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white">My Orders</h1>
              <p className="text-xs font-mono uppercase tracking-wider text-neutral-400 mt-1">
                {data.total} {data.total === 1 ? 'order' : 'orders'} total
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 border border-neutral-800 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 text-neutral-300">
              <Filter className="w-4 h-4 text-neutral-400" />
              <span className="text-xs font-mono uppercase tracking-wider font-semibold">Filter:</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 sm:px-4 py-2 text-xs font-bold uppercase tracking-wider min-h-[38px] transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-white text-black'
                    : 'border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600'
                }`}
              >
                All ({data.orders.length})
              </button>
              {Object.values(OrderStatus).map((status) => {
                const count = data.orders.filter((order) => order.status === status).length;
                return (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 sm:px-4 py-2 text-xs font-bold uppercase tracking-wider capitalize min-h-[38px] transition-colors ${
                      statusFilter === status
                        ? 'bg-white text-black'
                        : 'border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600'
                    }`}
                  >
                    {status} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="border border-neutral-800 p-8 text-center">
            <p className="text-xs font-mono uppercase tracking-wider text-neutral-400">No orders found with the selected filter.</p>
          </div>
        ) : (
          <OrderList orders={filteredOrders} onOrderClick={handleOrderClick} />
        )}

        {selectedOrder && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={handleCloseDetail}
          >
            <div
              className="bg-black border border-neutral-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-black border-b border-neutral-800 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-base font-bold uppercase tracking-wider text-white">Order Details</h2>
                <button
                  onClick={handleCloseDetail}
                  className="text-neutral-400 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <OrderDetail order={selectedOrder} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

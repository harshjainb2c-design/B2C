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

  // Redirect if not authenticated
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

  // Filter orders by status
  const filteredOrders = data?.orders?.filter((order) => {
    if (statusFilter === 'all') return true;
    return order.status === statusFilter;
  }) || [];

  // Find selected order
  const selectedOrder = selectedOrderId
    ? data?.orders.find((order) => order.id === selectedOrderId)
    : null;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta mx-auto mb-4"></div>
              <p className="text-sm text-taupe">Loading your orders...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-cream py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <Package className="w-16 h-16 text-beige-300 mb-6" />
              <h1 className="text-2xl font-bold text-warmBrown mb-3">
                Error Loading Orders
              </h1>
              <p className="text-sm text-taupe mb-8 max-w-md">
                We couldn't load your orders. Please try again later.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 text-sm font-semibold text-white bg-terracotta hover:bg-warmBrown uppercase tracking-wider"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!data?.orders || data.orders.length === 0) {
    return (
      <div className="min-h-screen bg-cream py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <Package className="w-16 h-16 text-beige-300 mb-6" />
              <h1 className="text-2xl font-bold text-warmBrown mb-3">
                No Orders Yet
              </h1>
              <p className="text-sm text-taupe mb-8 max-w-md">
                You haven't placed any orders yet. Start shopping to see your order history here!
              </p>
              <button
                onClick={handleBackToProducts}
                className="px-8 py-3 text-sm font-semibold text-white bg-terracotta hover:bg-warmBrown uppercase tracking-wider flex items-center gap-2"
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
    <div className="min-h-screen bg-cream py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 pb-6 border-b border-beige-300">
          <button
            onClick={handleBackToProducts}
            className="flex items-center gap-2 text-warmBrown hover:text-terracotta mb-4 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-warmBrown">My Orders</h1>
              <p className="text-sm text-taupe mt-1">
                {data.total} {data.total === 1 ? 'order' : 'orders'} total
              </p>
            </div>
          </div>
        </div>

        {/* Filter Bar - Mobile optimized */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 text-warmBrown">
              <Filter className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-semibold">Filter by status:</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-semibold uppercase tracking-wider min-h-[44px] rounded ${
                  statusFilter === 'all'
                    ? 'bg-terracotta text-white'
                    : 'bg-sand text-warmBrown hover:bg-beige-200'
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
                    className={`px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-semibold uppercase tracking-wider capitalize min-h-[44px] rounded ${
                      statusFilter === status
                        ? 'bg-terracotta text-white'
                        : 'bg-sand text-warmBrown hover:bg-beige-200'
                    }`}
                  >
                    {status} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-sm text-taupe">No orders found with the selected filter.</p>
          </div>
        ) : (
          <OrderList orders={filteredOrders} onOrderClick={handleOrderClick} />
        )}

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={handleCloseDetail}
          >
            <div
              className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-beige-300 px-6 py-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-warmBrown">Order Details</h2>
                <button
                  onClick={handleCloseDetail}
                  className="text-taupe hover:text-terracotta"
                  aria-label="Close"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
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

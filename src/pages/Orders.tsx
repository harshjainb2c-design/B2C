import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ArrowLeft } from 'lucide-react';
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

  const filteredOrders = data?.orders?.filter((order) => {
    if (statusFilter === 'all') return true;
    return order.status === statusFilter;
  }) || [];

  const selectedOrder = selectedOrderId
    ? data?.orders.find((order) => order.id === selectedOrderId)
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-inter">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mx-auto mb-3" />
          <p className="text-xs text-neutral-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-inter">
        <div className="text-center px-4">
          <Package className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
          <h1 className="text-lg font-semibold text-white mb-1">Error Loading Orders</h1>
          <p className="text-xs text-neutral-500 mb-4">We couldn't load your orders. Please try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 text-xs font-medium text-black bg-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data?.orders || data.orders.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-inter">
        <div className="text-center px-4">
          <Package className="w-10 h-10 text-neutral-700 mx-auto mb-3" />
          <h1 className="text-lg font-semibold text-white mb-1">No Orders Yet</h1>
          <p className="text-xs text-neutral-500 mb-4">Start shopping to see your orders here.</p>
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-medium text-black bg-white rounded-lg"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-6 sm:py-8 font-inter">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-5">
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-1 text-xs text-neutral-500 mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
          <h1 className="text-xl font-semibold text-white">My Orders</h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            {data.total} {data.total === 1 ? 'order' : 'orders'}
          </p>
        </div>

        <div className="flex gap-1.5 mb-4 overflow-x-auto scrollbar-none pb-1">
          <button
            onClick={() => setStatusFilter('all')}
            className={`flex-shrink-0 px-3 py-1.5 text-[11px] font-medium rounded-full ${
              statusFilter === 'all'
                ? 'bg-white text-black'
                : 'bg-white/5 text-neutral-400 border border-white/10'
            }`}
          >
            All ({data.orders.length})
          </button>
          {Object.values(OrderStatus).map((status) => {
            const count = data.orders.filter((order) => order.status === status).length;
            if (count === 0) return null;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`flex-shrink-0 px-3 py-1.5 text-[11px] font-medium rounded-full capitalize ${
                  statusFilter === status
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-neutral-400 border border-white/10'
                }`}
              >
                {status} ({count})
              </button>
            );
          })}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="border border-white/10 rounded-lg p-6 text-center">
            <p className="text-xs text-neutral-500">No orders with this filter.</p>
          </div>
        ) : (
          <OrderList orders={filteredOrders} onOrderClick={(id) => setSelectedOrderId(id)} />
        )}

        {selectedOrder && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedOrderId(null)}
          >
            <div
              className="bg-[#0a0a0a] border border-white/10 rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-[#0a0a0a] border-b border-white/10 px-5 py-3.5 flex items-center justify-between z-10 rounded-t-xl">
                <h2 className="text-sm font-semibold text-white">Order Details</h2>
                <button
                  onClick={() => setSelectedOrderId(null)}
                  className="text-neutral-500"
                  aria-label="Close"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-5">
                <OrderDetail order={selectedOrder} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

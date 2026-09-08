import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminOrders } from '../../hooks/useAdminOrders';
import { OrderStatus, Order } from '../../types/order';
import { OrderStatusUpdate } from './OrderStatusUpdate';
import { format } from 'date-fns';
import { X, ChevronDown, ChevronUp, Package, Filter, ShoppingBag, User, ArrowLeft } from 'lucide-react';

const STATUS_OPTIONS: { value: OrderStatus | ''; label: string }[] = [
  { value: '', label: 'All Orders' },
  { value: OrderStatus.PENDING, label: 'Pending' },
  { value: OrderStatus.PROCESSING, label: 'Processing' },
  { value: OrderStatus.SHIPPED, label: 'Shipped' },
  { value: OrderStatus.DELIVERED, label: 'Delivered' },
  { value: OrderStatus.CANCELLED, label: 'Cancelled' },
];

const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return 'border border-white/20 bg-neutral-900 text-neutral-300';
    case OrderStatus.PROCESSING:
      return 'border border-white/30 bg-neutral-800 text-white';
    case OrderStatus.SHIPPED:
      return 'bg-white text-black font-bold';
    case OrderStatus.DELIVERED:
      return 'border border-white/40 bg-neutral-900 text-white';
    case OrderStatus.CANCELLED:
      return 'border border-white/10 bg-black text-neutral-500 line-through';
    default:
      return 'border border-white/15 bg-neutral-900 text-white';
  }
};

export const OrderManager = () => {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updatingOrder, setUpdatingOrder] = useState<Order | null>(null);

  const { data, isLoading, error } = useAdminOrders({
    status: statusFilter || undefined,
  });

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleUpdateStatus = (order: Order) => {
    setUpdatingOrder(order);
  };

  const handleCloseModal = () => {
    setUpdatingOrder(null);
  };

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
                OPERATIONS
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white uppercase tracking-tight">
                ORDER MANAGEMENT
              </h1>
            </div>
          </div>

          {data && (
            <div className="flex items-center gap-2">
              <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-neutral-900 border border-white/15 text-white">
                Total Orders: {data.total}
              </span>
            </div>
          )}
        </div>

        <div className="bg-neutral-950 border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label htmlFor="status-filter" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
              <Filter className="h-3.5 w-3.5 text-neutral-400" />
              <span>Filter Status:</span>
            </label>
            <div className="flex-1 max-w-xs">
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as OrderStatus | '')}
                className="w-full rounded-xl bg-black border border-white/15 text-white text-xs px-4 py-2.5 outline-none focus:border-white transition-colors"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value} className="bg-black text-white">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {isLoading && (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-neutral-950 rounded-2xl p-5 space-y-3 animate-pulse">
                  <div className="h-5 bg-neutral-900 rounded w-1/3" />
                  <div className="h-4 bg-neutral-900 rounded w-1/4" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="bg-neutral-950 rounded-2xl border border-white/10 p-12 text-center">
              <p className="text-sm font-bold text-white uppercase">Error loading orders</p>
              <p className="text-xs text-neutral-400 mt-1">{error.message}</p>
            </div>
          )}

          {data && data.orders.length === 0 && (
            <div className="bg-neutral-950 rounded-2xl border border-white/10 p-16 text-center">
              <p className="text-sm font-bold text-white uppercase">No orders found</p>
              <p className="text-xs text-neutral-500 mt-1">Try changing the status filter</p>
            </div>
          )}

          {data && data.orders.length > 0 && (
            <div className="space-y-3">
              {data.orders.map((order) => {
                const badgeStyle = getStatusBadge(order.status);
                const isExpanded = expandedOrder === order.id;

                return (
                  <div
                    key={order.id}
                    className="bg-neutral-950 border border-white/10 rounded-2xl overflow-hidden"
                  >
                    <div
                      className="p-4 sm:p-5 cursor-pointer select-none"
                      onClick={() => toggleOrderExpansion(order.id)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-start sm:items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/15 flex items-center justify-center text-white shrink-0">
                            <Package className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-extrabold text-white tracking-wide">
                                #{order.id.slice(0, 8).toUpperCase()}
                              </span>
                              <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${badgeStyle}`}>
                                {order.status}
                              </span>
                            </div>
                            <p className="text-xs text-neutral-400 mt-0.5">
                              {format(new Date(order.createdAt), 'dd MMM yyyy, HH:mm')} · {order.shippingAddress.fullName}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                          <div className="text-left sm:text-right">
                            <p className="text-[10px] uppercase font-bold tracking-wider text-neutral-500">Amount</p>
                            <p className="text-base sm:text-lg font-extrabold text-white">
                              ₹{order.total.toFixed(0)}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateStatus(order);
                              }}
                              className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider bg-white text-black rounded-xl active:bg-neutral-200 transition-colors"
                            >
                              Update
                            </button>
                            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 bg-neutral-900">
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-4 pb-5 pt-3 sm:px-6 sm:pb-6 border-t border-white/10 bg-black/40">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                          <div className="bg-neutral-900 border border-white/10 rounded-xl p-4 space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                              <User className="w-3.5 h-3.5 text-neutral-400" />
                              Customer Information
                            </h4>
                            <div className="space-y-2 text-xs">
                              <p className="text-white font-medium">Name: {order.shippingAddress.fullName}</p>
                              <p className="text-neutral-300">Phone: {order.shippingAddress.phone}</p>
                              <div className="text-neutral-400 leading-relaxed">
                                <p>Address: {order.shippingAddress.addressLine1}</p>
                                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}</p>
                                <p>{order.shippingAddress.country}</p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-neutral-900 border border-white/10 rounded-xl p-4 space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                              <ShoppingBag className="w-3.5 h-3.5 text-neutral-400" />
                              Ordered Products
                            </h4>
                            <div className="space-y-2">
                              {order.items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between p-2.5 rounded-lg bg-black border border-white/5 text-xs"
                                >
                                  <div>
                                    <p className="font-semibold text-white">{item.product.name}</p>
                                    <p className="text-neutral-400 text-[11px]">
                                      Qty: {item.quantity} × ₹{item.price.toFixed(0)} {item.size ? `· Size: ${item.size}` : ''}
                                    </p>
                                  </div>
                                  <p className="font-bold text-white">
                                    ₹{(item.price * item.quantity).toFixed(0)}
                                  </p>
                                </div>
                              ))}
                              <div className="flex justify-between items-center pt-2 border-t border-white/10 text-xs font-bold text-white">
                                <span>Total Amount</span>
                                <span className="text-sm">₹{order.total.toFixed(0)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[11px] text-neutral-400">
                          <div>
                            Payment: <span className="text-white font-semibold uppercase">{order.paymentMethod === 'online' ? 'Online (Razorpay)' : 'Cash on Delivery'}</span> · {order.paymentStatus.replace('_', ' ')}
                          </div>
                          {order.shiprocketShipmentId && (
                            <div className="font-mono text-neutral-300">
                              Shiprocket ID: {order.shiprocketShipmentId} {order.awbCode ? `· AWB: ${order.awbCode}` : ''}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {updatingOrder && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-neutral-950 border border-white/20 rounded-2xl max-w-md w-full p-6 overflow-hidden">
            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
              <div>
                <h3 className="text-base font-extrabold text-white uppercase tracking-wide">
                  Update Order
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Order #{updatingOrder.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-neutral-400 active:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <OrderStatusUpdate
              orderId={updatingOrder.id}
              currentStatus={updatingOrder.status}
              onSuccess={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

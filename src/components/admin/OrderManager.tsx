import { useState } from 'react';
import { useAdminOrders } from '../../hooks/useAdminOrders';
import { OrderStatus, Order } from '../../types/order';
import { OrderStatusUpdate } from './OrderStatusUpdate';
import { format } from 'date-fns';
import { X, ChevronDown, ChevronUp, Clock, Package, Truck, CheckCircle, XCircle, Filter, ShoppingBag, MapPin, Phone, User } from 'lucide-react';

const STATUS_OPTIONS: { value: OrderStatus | ''; label: string }[] = [
  { value: '', label: 'All Orders' },
  { value: OrderStatus.PENDING, label: 'Pending' },
  { value: OrderStatus.PROCESSING, label: 'Processing' },
  { value: OrderStatus.SHIPPED, label: 'Shipped' },
  { value: OrderStatus.DELIVERED, label: 'Delivered' },
  { value: OrderStatus.CANCELLED, label: 'Cancelled' },
];

const getStatusConfig = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return {
        color: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: Clock,
        iconColor: 'text-amber-600',
      };
    case OrderStatus.PROCESSING:
      return {
        color: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: Package,
        iconColor: 'text-blue-600',
      };
    case OrderStatus.SHIPPED:
      return {
        color: 'bg-purple-50 text-purple-700 border-purple-200',
        icon: Truck,
        iconColor: 'text-purple-600',
      };
    case OrderStatus.DELIVERED:
      return {
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: CheckCircle,
        iconColor: 'text-emerald-600',
      };
    case OrderStatus.CANCELLED:
      return {
        color: 'bg-red-50 text-red-700 border-red-200',
        icon: XCircle,
        iconColor: 'text-red-600',
      };
    default:
      return {
        color: 'bg-gray-50 text-gray-700 border-gray-200',
        icon: Package,
        iconColor: 'text-gray-600',
      };
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Order Management</h2>
            <p className="text-base sm:text-lg text-gray-600">Track and manage all customer orders</p>
          </div>
          {data && (
            <div className="text-left sm:text-right">
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{data.total}</p>
            </div>
          )}
        </div>

        {/* Filter Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
          <div className="max-w-md">
            <label htmlFor="status-filter" className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-2">
              <Filter className="h-4 w-4 text-gray-500" />
              Filter by Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | '')}
              className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2.5 sm:px-4 sm:py-3 border transition-all text-sm sm:text-base"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {isLoading && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-20 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
              <p className="mt-6 text-lg font-medium text-gray-600">Loading orders...</p>
            </div>
          )}

          {error && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-20 text-center">
              <div className="bg-red-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-red-600" />
              </div>
              <p className="text-red-600 font-medium">Error loading orders</p>
              <p className="text-sm text-gray-600 mt-1">{error.message}</p>
            </div>
          )}

          {data && data.orders.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-20 text-center">
              <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium text-lg">No orders found</p>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your filters</p>
            </div>
          )}

          {data && data.orders.length > 0 && (
            <>
              {data.orders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                    <div
                      className="px-4 py-4 sm:px-6 sm:py-5 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleOrderExpansion(order.id)}
                    >
                      <div className="flex items-start sm:items-center gap-3 sm:gap-6">
                        <div className={`${statusConfig.color.split(' ')[0]} rounded-xl p-2 sm:p-3 flex-shrink-0`}>
                          <StatusIcon className={`h-5 w-5 sm:h-6 sm:w-6 ${statusConfig.iconColor}`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1">
                            <p className="text-sm sm:text-base font-bold text-gray-900 truncate">
                              Order #{order.id.slice(0, 8).toUpperCase()}
                            </p>
                            <span
                              className={`px-2.5 py-1 text-xs font-bold rounded-full border ${statusConfig.color} self-start`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {format(new Date(order.createdAt), 'MMM dd, yyyy • HH:mm')}
                          </p>
                          <div className="mt-2 sm:hidden">
                            <p className="text-xs text-gray-500">Total Amount</p>
                            <p className="text-xl font-bold text-gray-900">
                              ₹{order.total.toFixed(0)}
                            </p>
                          </div>
                        </div>

                        <div className="hidden sm:block text-right flex-shrink-0">
                          <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                          <p className="text-2xl font-bold text-gray-900">
                            ₹{order.total.toFixed(0)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateStatus(order);
                          }}
                          className="flex-1 sm:flex-none px-3 py-2 sm:px-4 text-xs sm:text-sm font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 shadow-sm hover:shadow-md transition-all"
                        >
                          Update Status
                        </button>
                        {expandedOrder === order.id ? (
                          <ChevronUp className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 flex-shrink-0" />
                        )}
                      </div>
                    </div>

                    {expandedOrder === order.id && (
                      <div className="px-4 py-5 sm:px-6 sm:py-6 bg-gradient-to-br from-gray-50 to-white border-t border-gray-100">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8">
                          {/* Customer Information */}
                          <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
                            <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                              <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                              Customer Information
                            </h4>
                            <div className="space-y-3 sm:space-y-4">
                              <div className="flex items-start gap-2 sm:gap-3">
                                <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-gray-500 uppercase">Full Name</p>
                                  <p className="text-sm font-medium text-gray-900 break-words">{order.shippingAddress.fullName}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-start gap-2 sm:gap-3">
                                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-gray-500 uppercase">Phone</p>
                                  <p className="text-sm font-medium text-gray-900 break-words">{order.shippingAddress.phone}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-start gap-2 sm:gap-3">
                                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-gray-500 uppercase">Shipping Address</p>
                                  <p className="text-sm text-gray-900 leading-relaxed break-words">
                                    {order.shippingAddress.addressLine1}
                                    {order.shippingAddress.addressLine2 && (
                                      <>
                                        <br />
                                        {order.shippingAddress.addressLine2}
                                      </>
                                    )}
                                    <br />
                                    {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                                    {order.shippingAddress.postalCode}
                                    <br />
                                    {order.shippingAddress.country}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
                            <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                              Order Items
                            </h4>
                            <div className="space-y-2 sm:space-y-3">
                              {order.items.map((item, index) => (
                                <div
                                  key={index}
                                  className="flex items-start sm:items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 gap-3"
                                >
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 text-sm break-words">{item.product.name}</p>
                                    <p className="text-xs text-gray-600 mt-1">
                                      Qty: <span className="font-semibold">{item.quantity}</span> × ₹{item.price.toFixed(0)}
                                    </p>
                                  </div>
                                  <p className="font-bold text-gray-900 text-base sm:text-lg flex-shrink-0">
                                    ₹{(item.price * item.quantity).toFixed(0)}
                                  </p>
                                </div>
                              ))}
                              
                              <div className="flex justify-between items-center pt-3 sm:pt-4 border-t-2 border-gray-200 mt-3 sm:mt-4">
                                <p className="text-sm sm:text-base font-bold text-gray-900">Total</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">₹{order.total.toFixed(0)}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-gray-200">
                          <p className="text-xs text-gray-500 break-all">
                            Payment: Cash on Delivery · {order.paymentStatus.replace('_', ' ')}
                          </p>
                          {order.shiprocketShipmentId && (
                            <p className="mt-1 text-xs text-gray-500 font-mono break-all">
                              Shiprocket shipment: {order.shiprocketShipmentId}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {data.totalPages > 1 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 text-center">
                  <p className="text-xs sm:text-sm text-gray-600">
                    Showing <span className="font-semibold text-gray-900">{data.orders.length}</span> of{' '}
                    <span className="font-semibold text-gray-900">{data.total}</span> orders
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Update Status Modal */}
      {updatingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transform transition-all">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-5 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-white">
                  Update Order Status
                </h3>
                <p className="text-blue-100 text-sm mt-1">
                  Order #{updatingOrder.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-all"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="px-6 py-6">
              <OrderStatusUpdate
                orderId={updatingOrder.id}
                currentStatus={updatingOrder.status}
                onSuccess={handleCloseModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

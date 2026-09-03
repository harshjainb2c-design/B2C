import { Link } from 'react-router-dom';
import { useAdminOrders } from '../../hooks/useAdminOrders';
import { useProducts } from '../../hooks/useProducts';
import { OrderStatus } from '../../types/order';
import { Package, ShoppingCart, DollarSign, Clock, Truck, CheckCircle, ArrowRight } from 'lucide-react';

export const AdminDashboard = () => {
  const { data: ordersData } = useAdminOrders();
  const { data: productsData } = useProducts();

  // Calculate metrics
  const totalOrders = ordersData?.total || 0;
  const totalProducts = productsData?.total || 0;
  
  const totalRevenue = ordersData?.orders
    .filter((order) => order.status !== OrderStatus.CANCELLED)
    .reduce((sum, order) => sum + order.total, 0) || 0;

  const pendingOrders = ordersData?.orders.filter(
    (order) => order.status === OrderStatus.PENDING
  ).length || 0;

  const processingOrders = ordersData?.orders.filter(
    (order) => order.status === OrderStatus.PROCESSING
  ).length || 0;

  const shippedOrders = ordersData?.orders.filter(
    (order) => order.status === OrderStatus.SHIPPED
  ).length || 0;

  const deliveredOrders = ordersData?.orders.filter(
    (order) => order.status === OrderStatus.DELIVERED
  ).length || 0;

  const metrics = [
    {
      name: 'Total Revenue',
      value: `₹${totalRevenue.toFixed(0)}`,
      icon: DollarSign,
      gradient: 'from-emerald-500 to-green-600',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      change: '+12.5%',
    },
    {
      name: 'Total Orders',
      value: totalOrders.toString(),
      icon: ShoppingCart,
      gradient: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      change: '+8.2%',
    },
    {
      name: 'Total Products',
      value: totalProducts.toString(),
      icon: Package,
      gradient: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      change: '+3',
    },
    {
      name: 'Pending Orders',
      value: pendingOrders.toString(),
      icon: Clock,
      gradient: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      change: pendingOrders > 0 ? 'Needs attention' : 'All clear',
    },
  ];

  const orderStatusBreakdown = [
    { 
      status: 'Pending', 
      count: pendingOrders, 
      icon: Clock,
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
      barColor: 'bg-amber-500',
      borderColor: 'border-amber-200'
    },
    { 
      status: 'Processing', 
      count: processingOrders, 
      icon: Package,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      barColor: 'bg-blue-500',
      borderColor: 'border-blue-200'
    },
    { 
      status: 'Shipped', 
      count: shippedOrders, 
      icon: Truck,
      color: 'text-purple-700',
      bgColor: 'bg-purple-50',
      barColor: 'bg-purple-500',
      borderColor: 'border-purple-200'
    },
    { 
      status: 'Delivered', 
      count: deliveredOrders, 
      icon: CheckCircle,
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      barColor: 'bg-emerald-500',
      borderColor: 'border-emerald-200'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-base sm:text-lg text-gray-600">Welcome back! Here's what's happening with your store today.</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm text-gray-500">Last updated</p>
            <p className="text-sm font-semibold text-gray-900">{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {metrics.map((metric) => (
            <div
              key={metric.name}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className={`${metric.bgColor} rounded-xl p-2.5 sm:p-3`}>
                    <metric.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${metric.iconColor}`} />
                  </div>
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {metric.change}
                  </span>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                    {metric.name}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{metric.value}</p>
                </div>
              </div>
              <div className={`h-1 bg-gradient-to-r ${metric.gradient}`}></div>
            </div>
          ))}
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Order Status</h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Track your orders at every stage</p>
              </div>
              <Link 
                to="/admin/orders"
                className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 self-start sm:self-auto"
              >
                View all orders
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {orderStatusBreakdown.map((item) => (
                <div 
                  key={item.status} 
                  className={`${item.bgColor} border-2 ${item.borderColor} rounded-xl p-4 sm:p-5 hover:shadow-md transition-all duration-200`}
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <item.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${item.color}`} />
                    <p className={`text-xs sm:text-sm font-bold ${item.color} uppercase tracking-wide`}>
                      {item.status}
                    </p>
                  </div>
                  <p className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">{item.count}</p>
                  <div className="w-full bg-white rounded-full h-2 sm:h-2.5 overflow-hidden">
                    <div 
                      className={`h-2 sm:h-2.5 rounded-full ${item.barColor} transition-all duration-500`}
                      style={{ width: `${totalOrders > 0 ? (item.count / totalOrders) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    {totalOrders > 0 ? `${((item.count / totalOrders) * 100).toFixed(0)}% of total` : '0% of total'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <Link
            to="/admin/products"
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
          >
            <div className="p-5 sm:p-6 lg:p-8">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-3 sm:p-4 group-hover:scale-110 transition-transform duration-300">
                  <Package className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Manage Products</h3>
              <p className="text-sm sm:text-base text-gray-600">Add, edit, or remove products from your inventory</p>
            </div>
            <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-600"></div>
          </Link>
          
          <Link
            to="/admin/orders"
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
          >
            <div className="p-5 sm:p-6 lg:p-8">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-3 sm:p-4 group-hover:scale-110 transition-transform duration-300">
                  <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Manage Orders</h3>
              <p className="text-sm sm:text-base text-gray-600">View, update, and track all customer orders</p>
            </div>
            <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          </Link>
        </div>
      </div>
    </div>
  );
};

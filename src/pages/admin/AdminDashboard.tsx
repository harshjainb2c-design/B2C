import { Link } from 'react-router-dom';
import { useAdminOrders } from '../../hooks/useAdminOrders';
import { useProducts } from '../../hooks/useProducts';
import { OrderStatus } from '../../types/order';
import { Package, ShoppingCart, DollarSign, Clock, Truck, CheckCircle, ArrowRight, Settings, ArrowLeft } from 'lucide-react';

export const AdminDashboard = () => {
  const { data: ordersData } = useAdminOrders();
  const { data: productsData } = useProducts();

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
      note: 'All completed & pending orders',
    },
    {
      name: 'Total Orders',
      value: totalOrders.toString(),
      icon: ShoppingCart,
      note: 'Lifetime store orders',
    },
    {
      name: 'Total Products',
      value: totalProducts.toString(),
      icon: Package,
      note: 'Live inventory items',
    },
    {
      name: 'Pending Orders',
      value: pendingOrders.toString(),
      icon: Clock,
      note: pendingOrders > 0 ? 'Requires attention' : 'All orders processed',
    },
  ];

  const orderStatusBreakdown = [
    { status: 'Pending', count: pendingOrders, icon: Clock },
    { status: 'Processing', count: processingOrders, icon: Package },
    { status: 'Shipped', count: shippedOrders, icon: Truck },
    { status: 'Delivered', count: deliveredOrders, icon: CheckCircle },
  ];

  const quickActions = [
    {
      title: 'Product Catalog',
      description: 'Add new items, update stock, manage sizes & categories',
      link: '/admin/products',
      icon: Package,
    },
    {
      title: 'Order Operations',
      description: 'Review customer orders, update tracking & delivery status',
      link: '/admin/orders',
      icon: ShoppingCart,
    },
    {
      title: 'API & Gateway Settings',
      description: 'Configure Razorpay online payments & Shiprocket logistics',
      link: '/admin/settings',
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 lg:p-8 font-inter select-none">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
                ADMIN PANEL
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
              STORE MANAGEMENT
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Real-time monitoring, catalog control, and logistics operations
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-neutral-900 border border-white/15 active:bg-neutral-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>View Store</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.name}
                className="bg-neutral-950 border border-white/10 rounded-2xl p-5 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    {metric.name}
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-neutral-900 border border-white/15 flex items-center justify-center text-white">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {metric.value}
                  </p>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    {metric.note}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400 mb-3">
            MANAGEMENT MODULES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const ActionIcon = action.icon;
              return (
                <Link
                  key={action.title}
                  to={action.link}
                  className="bg-neutral-950 border border-white/10 rounded-2xl p-5 flex flex-col justify-between active:border-white/40 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/15 flex items-center justify-center text-white">
                      <ActionIcon className="w-5 h-5" />
                    </div>
                    <div className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-white bg-neutral-900">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white uppercase tracking-wide">
                      {action.title}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      {action.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="bg-neutral-950 border border-white/10 rounded-2xl p-5 sm:p-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400 mb-4">
            ORDER STATUS BREAKDOWN
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {orderStatusBreakdown.map((item) => {
              const StatusIcon = item.icon;
              const percentage = totalOrders > 0 ? Math.round((item.count / totalOrders) * 100) : 0;
              return (
                <div
                  key={item.status}
                  className="bg-black border border-white/10 rounded-xl p-4 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-neutral-400">
                      {item.status}
                    </span>
                    <StatusIcon className="w-4 h-4 text-neutral-400" />
                  </div>
                  <p className="text-2xl font-extrabold text-white">
                    {item.count}
                  </p>
                  <div className="mt-3">
                    <div className="w-full bg-neutral-900 rounded-full h-1.5 overflow-hidden border border-white/5">
                      <div
                        className="bg-white h-full rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-neutral-500 font-medium mt-1 block">
                      {percentage}% of all orders
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

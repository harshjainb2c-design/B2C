import { Link } from 'react-router-dom';
import { useAdminOrders } from '../../hooks/useAdminOrders';
import { useProducts } from '../../hooks/useProducts';
import { OrderStatus } from '../../types/order';
import { Package, ShoppingCart, DollarSign, Clock, Truck, CheckCircle, ArrowRight, Settings } from 'lucide-react';

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
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 lg:p-8 font-inter select-none">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase">ADMIN CONSOLE</span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white uppercase tracking-tight mt-1">Dashboard</h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">Real-time overview of revenue, orders, and drops.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/settings"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-white border border-white"
            >
              <Settings className="w-4 h-4" />
              <span>API Settings</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {metrics.map((metric) => (
            <div
              key={metric.name}
              className="bg-neutral-950/60 rounded-2xl border border-white/10 p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="rounded-xl p-2.5 bg-neutral-900 border border-white/10 text-white">
                  <metric.icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-neutral-400 bg-neutral-900 border border-white/10 px-2 py-0.5 rounded-full">
                  {metric.change}
                </span>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-0.5">{metric.name}</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">{metric.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-neutral-950/60 rounded-2xl border border-white/10 p-5 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider">Order Status Pipeline</h2>
              <p className="text-xs text-neutral-400 mt-0.5">Live shipment lifecycle across Indian pin codes</p>
            </div>
            <Link 
              to="/admin/orders"
              className="text-xs font-bold uppercase tracking-wider text-white underline flex items-center gap-1"
            >
              View all orders
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {orderStatusBreakdown.map((item) => (
              <div 
                key={item.status} 
                className="bg-black border border-white/10 rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <item.icon className="h-4 w-4 text-white" />
                  <p className="text-xs font-bold text-white uppercase tracking-wide">
                    {item.status}
                  </p>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white mb-2">{item.count}</p>
                <div className="w-full bg-neutral-900 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="h-1.5 rounded-full bg-white"
                    style={{ width: `${totalOrders > 0 ? (item.count / totalOrders) * 100 : 0}%` }}
                  />
                </div>
                <p className="text-[10px] text-neutral-400 mt-1.5">
                  {totalOrders > 0 ? `${((item.count / totalOrders) * 100).toFixed(0)}% of total` : '0% of total'}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/products"
            className="bg-neutral-950/60 rounded-2xl border border-white/10 p-6 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-white mb-3">
                <Package className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider mb-1">Manage Catalog</h3>
              <p className="text-xs text-neutral-400">Add, edit, or adjust inventory and sizes for active drops.</p>
            </div>
            <div className="pt-4 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-white">
              <span>Open Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
          
          <Link
            to="/admin/orders"
            className="bg-neutral-950/60 rounded-2xl border border-white/10 p-6 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-white mb-3">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider mb-1">Manage Orders</h3>
              <p className="text-xs text-neutral-400">Track shipments, verify payments, and monitor deliveries.</p>
            </div>
            <div className="pt-4 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-white">
              <span>Open Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            to="/admin/settings"
            className="bg-neutral-950/60 rounded-2xl border border-white/10 p-6 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-white mb-3">
                <Settings className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider mb-1">API Integrations</h3>
              <p className="text-xs text-neutral-400">Configure Razorpay Key ID/Secret & Shiprocket API credentials.</p>
            </div>
            <div className="pt-4 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-white">
              <span>Open Settings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

import { lazy, Suspense, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { AdminRoute } from './components/auth/AdminRoute';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ScrollToTop } from './components/common/ScrollToTop';
import { useAuthStore } from './stores/authStore';

const PageLoader = () => (
  <div className="min-h-screen bg-black text-white flex items-center justify-center font-inter">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-white/20 border-t-white"></div>
      <p className="mt-4 text-xs font-inter font-bold tracking-widest text-neutral-400 uppercase">Loading Archive...</p>
    </div>
  </div>
);

const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Products = lazy(() => import('./pages/Products').then(m => ({ default: m.Products })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })));
const Cart = lazy(() => import('./pages/Cart').then(m => ({ default: m.Cart })));
const Checkout = lazy(() => import('./pages/Checkout').then(m => ({ default: m.Checkout })));
const Orders = lazy(() => import('./pages/Orders').then(m => ({ default: m.Orders })));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation').then(m => ({ default: m.OrderConfirmation })));
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/Register').then(m => ({ default: m.Register })));
const PasswordReset = lazy(() => import('./pages/PasswordReset').then(m => ({ default: m.PasswordReset })));
const Unauthorized = lazy(() => import('./pages/Unauthorized').then(m => ({ default: m.Unauthorized })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));
const HealthCheck = lazy(() => import('./pages/HealthCheck').then(m => ({ default: m.HealthCheck })));
const Wishlist = lazy(() => import('./pages/Wishlist').then(m => ({ default: m.Wishlist })));

const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const Returns = lazy(() => import('./pages/Returns').then(m => ({ default: m.Returns })));
const Shipping = lazy(() => import('./pages/Shipping').then(m => ({ default: m.Shipping })));
const Cancellation = lazy(() => import('./pages/Cancellation').then(m => ({ default: m.Cancellation })));
const Privacy = lazy(() => import('./pages/Privacy').then(m => ({ default: m.Privacy })));
const Terms = lazy(() => import('./pages/Terms').then(m => ({ default: m.Terms })));
const Blog = lazy(() => import('./pages/Blog').then(m => ({ default: m.Blog })));
const Stores = lazy(() => import('./pages/Stores').then(m => ({ default: m.Stores })));
const Sitemap = lazy(() => import('./pages/Sitemap').then(m => ({ default: m.Sitemap })));

const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts').then(m => ({ default: m.AdminProducts })));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders').then(m => ({ default: m.AdminOrders })));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings').then(m => ({ default: m.AdminSettings })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent = () => {
  const location = useLocation();
  const initStartedRef = useRef(false);
  const isAuthPage = ['/login', '/register', '/password-reset', '/reset-password'].includes(
    location.pathname.toLowerCase()
  );

  useEffect(() => {
    if (!initStartedRef.current) {
      initStartedRef.current = true;
      useAuthStore.getState().initialize().catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!isAuthPage) {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }, [location.pathname, isAuthPage]);

  return (
    <div className={`bg-black text-white ${isAuthPage ? 'fixed inset-0 w-full h-full overflow-hidden' : 'min-h-screen flex flex-col'}`}>
      <ScrollToTop />
      {!isAuthPage && <Header />}
      <main className={`flex-1 ${isAuthPage ? 'w-full h-full overflow-hidden' : ''}`}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/men" element={<Navigate to="/products?gender=men" replace />} />
            <Route path="/women" element={<Navigate to="/products?gender=women" replace />} />
            <Route path="/sneakers" element={<Navigate to="/products?category=footwear" replace />} />
            <Route path="/mywishlist" element={<Wishlist />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/password-reset" element={<PasswordReset />} />
            <Route path="/reset-password" element={<PasswordReset />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/health" element={<HealthCheck />} />
            
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/cancellation" element={<Cancellation />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/stores" element={<Stores />} />
            <Route path="/sitemap" element={<Sitemap />} />

            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-confirmation/:orderId"
              element={
                <ProtectedRoute>
                  <OrderConfirmation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <AdminRoute>
                  <AdminProducts />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <AdminRoute>
                  <AdminOrders />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <AdminRoute>
                  <AdminSettings />
                </AdminRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
};

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

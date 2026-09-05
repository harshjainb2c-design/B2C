import { lazy, Suspense, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { AdminRoute } from './components/auth/AdminRoute';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ScrollToTop } from './components/common/ScrollToTop';
import { useAuthStore } from './stores/authStore';

const PageLoader = () => (
  <div className="min-h-screen bg-black text-white flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-white/20 border-t-white"></div>
      <p className="mt-4 text-xs font-mono tracking-widest text-neutral-400 uppercase">Loading Archive...</p>
    </div>
  </div>
);

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages').then(m => ({ default: m.Home })));
const Products = lazy(() => import('./pages').then(m => ({ default: m.Products })));
const ProductDetailPage = lazy(() => import('./pages').then(m => ({ default: m.ProductDetailPage })));
const Cart = lazy(() => import('./pages').then(m => ({ default: m.Cart })));
const Checkout = lazy(() => import('./pages').then(m => ({ default: m.Checkout })));
const Orders = lazy(() => import('./pages').then(m => ({ default: m.Orders })));
const OrderConfirmation = lazy(() => import('./pages').then(m => ({ default: m.OrderConfirmation })));
const Profile = lazy(() => import('./pages').then(m => ({ default: m.Profile })));
const Login = lazy(() => import('./pages').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages').then(m => ({ default: m.Register })));
const PasswordReset = lazy(() => import('./pages').then(m => ({ default: m.PasswordReset })));
const Unauthorized = lazy(() => import('./pages').then(m => ({ default: m.Unauthorized })));
const NotFound = lazy(() => import('./pages').then(m => ({ default: m.NotFound })));
const HealthCheck = lazy(() => import('./pages').then(m => ({ default: m.HealthCheck })));

// Info pages
const About = lazy(() => import('./pages').then(m => ({ default: m.About })));
const Contact = lazy(() => import('./pages').then(m => ({ default: m.Contact })));
const Returns = lazy(() => import('./pages').then(m => ({ default: m.Returns })));
const Shipping = lazy(() => import('./pages').then(m => ({ default: m.Shipping })));
const Cancellation = lazy(() => import('./pages').then(m => ({ default: m.Cancellation })));
const Privacy = lazy(() => import('./pages').then(m => ({ default: m.Privacy })));
const Terms = lazy(() => import('./pages').then(m => ({ default: m.Terms })));
const Blog = lazy(() => import('./pages').then(m => ({ default: m.Blog })));
const Stores = lazy(() => import('./pages').then(m => ({ default: m.Stores })));
const Sitemap = lazy(() => import('./pages').then(m => ({ default: m.Sitemap })));

// Admin pages
const AdminDashboard = lazy(() => import('./pages').then(m => ({ default: m.AdminDashboard })));
const AdminProducts = lazy(() => import('./pages').then(m => ({ default: m.AdminProducts })));
const AdminOrders = lazy(() => import('./pages').then(m => ({ default: m.AdminOrders })));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent = () => {
  const initStartedRef = useRef(false);

  // Initialize auth on mount - only once, even in StrictMode
  // But don't block the UI if it fails
  useEffect(() => {
    if (!initStartedRef.current) {
      initStartedRef.current = true;
      
      // Run in background without blocking UI
      useAuthStore.getState().initialize().catch(() => {
        // Auth initialization failed - user will need to login manually
      });
    }
  }, []); // Empty dependency array - only run once on mount

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/men" element={<Navigate to="/products?gender=men" replace />} />
          <Route path="/women" element={<Navigate to="/products?gender=women" replace />} />
          <Route path="/sneakers" element={<Navigate to="/products?category=footwear" replace />} />
          <Route path="/mywishlist" element={<Navigate to="/products" replace />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/health" element={<HealthCheck />} />
          
          {/* Info pages */}
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

          {/* Protected routes - require authentication */}
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

          {/* Admin routes - require admin role */}
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

          {/* 404 Not Found - must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

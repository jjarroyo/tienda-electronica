import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CatalogPage from './pages/CatalogPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './auth/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import ProductListPage from './pages/ProductListPage'; 
import ProductCreatePage from './pages/ProductCreatePage'; 
import ProductEditPage from './pages/ProductEditPage'; 
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import PublicLayout from './components/PublicLayout';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AdminOrderListPage from './pages/AdminOrderListPage';
import AdminOrderDetailPage from './pages/AdminOrderDetailPage';
import AdminCategoryListPage from './pages/AdminCategoryListPage'; 
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
import LandingPage from './pages/LandingPage';
import RootLayout from './components/RootLayout';
function App() {
  return (
    <Router>
      <Routes>        
        <Route path="/" element={<RootLayout />}>
        
          <Route element={<PublicLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="products" element={<CatalogPage />} />
            <Route path="product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="order-confirmation" element={<OrderConfirmationPage />} />
            <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="terms-and-conditions" element={<TermsAndConditionsPage />} />
            {/* <Route path="contact" element={<ContactPage />} /> */}
          </Route>
        
          <Route path="/admin/login" element={<LoginPage />} />

            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<ProductListPage />} />
            <Route path="products/create" element={<ProductCreatePage />} /> 
            <Route path="products/edit/:id" element={<ProductEditPage />} />
            <Route path="orders" element={<AdminOrderListPage />} />
            <Route path="orders/:id" element={<AdminOrderDetailPage />} />
            <Route path="categories" element={<AdminCategoryListPage />} /> 

          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
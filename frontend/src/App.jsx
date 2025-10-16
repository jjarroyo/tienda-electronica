import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
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
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-confirmation" element={<OrderConfirmationPage />} />

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
      </Routes>
    </Router>
  );
}

export default App;
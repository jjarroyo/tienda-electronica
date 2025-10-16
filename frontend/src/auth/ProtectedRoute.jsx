import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // Si no hay token, redirigir al login
    return <Navigate to="/admin/login" />;
  }

  return children; // Si hay token, mostrar el componente hijo (el dashboard)
};

export default ProtectedRoute;
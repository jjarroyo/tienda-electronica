import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { FaDollarSign, FaShoppingCart, FaBoxOpen, FaClock } from 'react-icons/fa';

// Componente reutilizable para las tarjetas
function StatCard({ title, value, icon, formatAsCurrency = false }) {
  const displayValue = formatAsCurrency 
    ? `$${Number(value).toLocaleString('es-CO')}` 
    : value;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
      <div className="text-3xl text-white bg-blue-500 rounded-full p-3 mr-4">{icon}</div>
      <div>
        <p className="text-gray-600">{title}</p>
        <p className="text-2xl font-bold">{displayValue}</p>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data.data);
      } catch (error) {
        console.error("Error al cargar las estadísticas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading) {
    return <p>Cargando estadísticas...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Ventas Totales" value={stats.totalSales} icon={<FaDollarSign />} formatAsCurrency={true} />
          <StatCard title="Órdenes Totales" value={stats.totalOrders} icon={<FaShoppingCart />} />
          <StatCard title="Productos Activos" value={stats.totalProducts} icon={<FaBoxOpen />} />
          <StatCard title="Órdenes Pendientes" value={stats.pendingOrders} icon={<FaClock />} />
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
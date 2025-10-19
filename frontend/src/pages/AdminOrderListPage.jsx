import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
function AdminOrderListPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/admin/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data.data);
      } catch (error) {
        console.error("Error al cargar las órdenes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de que quieres eliminar esta orden?')) {
      try {
        await api.delete(`/admin/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(orders.filter(order => order.id !== id));
      } catch (error) {
        console.error("Error al eliminar la orden", error);
        alert("No se pudo eliminar la orden.");
      }
    }
  };

  const statusColors = {
    pendiente: 'text-yellow-900 bg-yellow-200',
    aprobado: 'text-green-900 bg-green-200',
    enviado: 'text-blue-900 bg-blue-200',
    entregado: 'text-purple-900 bg-purple-200',
    cancelado: 'text-red-900 bg-red-200',
  };

  if (loading) {
    return <p>Cargando órdenes...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestión de Órdenes</h1>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Cliente</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Fecha</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Total</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Estado</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500">No hay órdenes para mostrar.</td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.id} onClick={() => navigate(`/admin/orders/${order.id}`)} className="cursor-pointer hover:bg-gray-50">

                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900">{order.customerName}</p>
                    <p className="text-gray-600">{order.email}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {new Date(order.createdAt).toLocaleDateString('es-CO')}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    ${order.total.toLocaleString('es-CO')}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full capitalize ${statusColors[order.status] || 'bg-gray-200'}`}>
                      {order.status}
                    </span>
                  </td>

                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                    <button onClick={(e) => handleDelete(e, order.id)} className="text-red-600 hover:text-red-900">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrderListPage;
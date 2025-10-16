import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
function AdminOrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const [trackingUrl, setTrackingUrl] = useState(''); 

   const fetchOrder = async () => {
    try {
        setLoading(true);
        const res = await api.get(`/admin/orders/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setOrder(res.data.data);
    } catch (error) {
        console.error("Error al cargar la orden:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id, token]);

  const handleStatusChange = async (newStatus) => {
    try {
      const payload = { status: newStatus };

      if (newStatus === 'enviado') {
        if (!trackingUrl) {
            toast.error('Por favor, ingresa la URL de seguimiento.');
            return;
        }
        payload.trackingUrl = trackingUrl;
      }

      await api.put(`/admin/orders/${id}/status`, 
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('¡Estado de la orden actualizado!');
      // Volvemos a cargar los datos de la orden para reflejar el cambio
      fetchOrder();
    } catch (error) {
      toast.error('No se pudo actualizar el estado.');
      console.error("Error al actualizar estado:", error);
    }
  };


  const statusColors = {
    pendiente: 'bg-yellow-200 text-yellow-900',
    aprobado: 'bg-green-200 text-green-900',
    enviado: 'bg-blue-200 text-blue-900',
    entregado: 'bg-purple-200 text-purple-900',
    cancelado: 'bg-red-200 text-red-900',
  };

  if (loading) return <p>Cargando detalles de la orden...</p>;
  if (!order) return <p>Orden no encontrada.</p>;

  return (
    <div>
      <Link to="/admin/orders" className="text-blue-600 hover:underline mb-6 inline-block">&larr; Volver a la lista de órdenes</Link>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-2xl font-bold">Orden #{order.id}</h1>
                <p className="text-sm text-gray-500">Fecha: {new Date(order.createdAt).toLocaleString('es-CO')}</p>
            </div>
           <span className={`px-3 py-1 font-semibold leading-tight rounded-full text-sm capitalize ${statusColors[order.status] || 'bg-gray-200'}`}>
                {order.status}
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna de Items */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Items en la Orden</h2>
          <div className="space-y-4">
            {order.OrderItems.map(item => (
              <div key={item.id} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center">
                  <img src={item.Product.imagenUrl} alt={item.Product.nombre} className="w-16 h-16 rounded object-cover mr-4" />
                  <div>
                    <p className="font-semibold">{item.Product.nombre}</p>
                    <p className="text-sm text-gray-600">{item.quantity} x ${item.price.toLocaleString('es-CO')}</p>
                  </div>
                </div>
                <p className="font-semibold">${(item.quantity * item.price).toLocaleString('es-CO')}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Columna de Cliente y Totales */}
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Cliente y Envío</h2>
                <p><strong>Nombre:</strong> {order.customerName}</p>
                <p><strong>Email:</strong> {order.email}</p>
                <p><strong>Teléfono:</strong> {order.phone}</p>
                <p className="mt-2"><strong>Dirección:</strong> {order.address}, {order.city}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Totales</h2>
                <div className="flex justify-between text-gray-600"><p>Subtotal:</p><span>${order.subtotal.toLocaleString('es-CO')}</span></div>
                <div className="flex justify-between text-gray-600"><p>Envío:</p><span>${order.shippingCost.toLocaleString('es-CO')}</span></div>
                <hr className="my-2" />
                <div className="flex justify-between font-bold text-lg"><p>Total:</p><span>${order.total.toLocaleString('es-CO')}</span></div>
            </div>

             <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Actualizar Estado</h2>
                {order.status === 'aprobado' && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL de Seguimiento (Guía)</label>
                        <input 
                            type="text"
                            value={trackingUrl}
                            onChange={(e) => setTrackingUrl(e.target.value)}
                            placeholder="https://servientrega.com/guia/..."
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                )}
                <div className="flex flex-col space-y-2">
                    <button onClick={() => handleStatusChange('enviado')} className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400" disabled={order.status !== 'aprobado'}>
                        Marcar como Enviado
                    </button>
                    <button onClick={() => handleStatusChange('entregado')} className="bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 disabled:bg-gray-400" disabled={order.status !== 'enviado'}>
                        Marcar como Entregado
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOrderDetailPage;
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import api from '../api/axiosConfig';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { FaSpinner } from 'react-icons/fa'; 


function CheckoutPage() {
    const { cartItems, clearCart  } = useContext(CartContext);
    const navigate = useNavigate();
    const [customerData, setCustomerData] = useState({ name: '', address: '', city: 'Bogotá', phone: '', email: '' });
    const [paymentMethod, setPaymentMethod] = useState('mercadopago');
    const [isProcessing, setIsProcessing] = useState(false); 
    const shippingCost = 8000;
    const subtotal = cartItems.reduce((sum, item) => sum + item.precio * item.quantity, 0);
    const total = subtotal + shippingCost;


    const handleInputChange = (e) => {
        setCustomerData({ ...customerData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true); 
        try {
            const res = await api.post('/orders', { customerData, cartItems, paymentMethod });
            if (paymentMethod == 'contraentrega') {
                clearCart(); 
                navigate('/order-confirmation', { 
                    state: { success: true, orderId: res.data.orderId } 
                });
            } else {
                window.location.href = res.data.init_point;
            }
        } catch (error) {
            console.error("Error al procesar la orden", error);
            setIsProcessing(false);
        }finally {
            setIsProcessing(false); 
        }
    };

    const colombianCities = ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "Cúcuta", "Bucaramanga", "Pereira", "Santa Marta", "Ibagué"]; // Lista de ejemplo

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Finalizar Compra</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Formulario de Datos */}
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Tus Datos</h2>
                    {/* ... Campos del formulario ... */}
                    <input name="name" onChange={handleInputChange} placeholder="Nombre completo" required className="w-full p-2 mb-4 border rounded" />
                    <input name="address" onChange={handleInputChange} placeholder="Dirección de envío" required className="w-full p-2 mb-4 border rounded" />
                    <select name="city" onChange={handleInputChange} className="w-full p-2 mb-4 border rounded bg-white">
                        {colombianCities.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                    <input name="phone" onChange={handleInputChange} placeholder="Teléfono" required className="w-full p-2 mb-4 border rounded" />
                    <input type="email" name="email" onChange={handleInputChange} placeholder="Correo electrónico" required className="w-full p-2 mb-4 border rounded" />

                    <h2 className="text-xl font-semibold mb-4 mt-6">Método de Pago</h2>
                    <div className="space-y-2">
                       {/* ... Opciones de pago ... */}
                       <label className="flex items-center"><input type="radio" name="payment" value="mercadopago" checked={paymentMethod === 'mercadopago'} onChange={() => setPaymentMethod('mercadopago')} className="mr-2" /> Mercado Pago</label>
                       <label className="flex items-center"><input type="radio" name="payment" value="contraentrega" checked={paymentMethod === 'contraentrega'} onChange={() => setPaymentMethod('contraentrega')} className="mr-2" /> Pago Contra Entrega</label>
                    </div>

                    <button 
                       type="submit" 
                        className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex justify-center items-center disabled:bg-gray-400"
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                        <>
                            <FaSpinner className="animate-spin mr-2" />
                            Procesando...
                        </>
                        ) : (
                        'Realizar Pedido'
                        )}
                    </button>
                </form>

                {/* Resumen de la Orden */}
                <div className="bg-white p-6 rounded-lg shadow-md self-start">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-3">Resumen de tu Orden</h2>
                    
                    {/* Lista de productos en el carrito */}
                    <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex items-center justify-between text-sm">
                                <div className="flex items-center">
                                    <img src={item.imagenUrl} alt={item.nombre} className="w-12 h-12 rounded object-cover mr-3 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-gray-800">{item.nombre}</p>
                                        <p className="text-gray-500">Cantidad: {item.quantity}</p>
                                    </div>
                                </div>
                                {/* Formateamos el número para la moneda local (ej: 15000 -> 15.000) */}
                                <p className="font-medium text-gray-900">${(item.precio * item.quantity).toLocaleString('es-CO')}</p>
                            </div>
                        ))}
                    </div>

                    <hr className="my-4" />

                    {/* Totales */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-gray-600">
                            <p>Subtotal</p>
                            <p className="font-medium text-gray-800">${subtotal.toLocaleString('es-CO')}</p>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <p>Envío</p>
                            <p className="font-medium text-gray-800">${shippingCost.toLocaleString('es-CO')}</p>
                        </div>
                        <hr className="my-2" />
                        <div className="flex justify-between font-bold text-lg">
                            <p>Total</p>
                            <p>${total.toLocaleString('es-CO')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default CheckoutPage;
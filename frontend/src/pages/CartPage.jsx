import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';

function CartPage() {
    const { cartItems, removeFromCart, updateQuantity } =
        useContext(CartContext);

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.precio * item.quantity,
        0
    );
    const baseApiUrl =
        import.meta.env.VITE_API_UR.replace('/api', '') ||
        'https://tienda-electronica-3grv.onrender.com';
    return (
        <div className="bg-gray-100 min-h-screen py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-2xl font-semibold mb-4">
                    Tu Carrito de Compras
                </h1>
                {cartItems.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-lg shadow-md">
                        <p className="text-xl text-gray-600">
                            Tu carrito está vacío.
                        </p>
                        <Link
                            to="/"
                            className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                        >
                            Continuar Comprando
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Lista de Items */}
                        <div className="md:w-3/4">
                            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between items-center border-b pb-4 mb-4"
                                    >
                                        <div className="flex items-center">
                                            <img
                                                className="h-20 w-20 object-cover rounded mr-4"
                                                src={`${baseApiUrl}${item.imagenUrl}`}
                                                alt={item.nombre}
                                            />
                                            <div>
                                                <h2 className="font-semibold">
                                                    {item.nombre}
                                                </h2>
                                                <p className="text-gray-600 text-sm">
                                                    ${item.precio}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="number"
                                                min="1"
                                                max={item.stock}
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    updateQuantity(
                                                        item.id,
                                                        parseInt(e.target.value)
                                                    )
                                                }
                                                className="w-16 p-1 border rounded text-center"
                                            />
                                            <button
                                                onClick={() =>
                                                    removeFromCart(item.id)
                                                }
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Resumen del Pedido */}
                        <div className="md:w-1/4">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-lg font-semibold mb-4">
                                    Resumen del Pedido
                                </h2>
                                <div className="flex justify-between mb-2">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <hr className="my-2" />
                                <div className="flex justify-between font-semibold">
                                    <span>Total</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <Link
                                    to="/checkout"
                                    className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-center block"
                                >
                                    Proceder al Pago
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
export default CartPage;

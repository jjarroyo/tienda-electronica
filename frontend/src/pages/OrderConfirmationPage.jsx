import { Link, useLocation, Navigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useContext, useEffect } from 'react';

function OrderConfirmationPage() {
  const { clearCart } = useContext(CartContext);
  const location = useLocation();

  // Si no llegamos a esta página desde el checkout o Mercado Pago, redirigimos al inicio.
  // Esto previene que se pueda acceder a la URL directamente.
  const isSuccessfulNavigation = location.state?.success || window.location.search.includes('collection_status=approved');

  useEffect(() => {
    // Limpiar el carrito SOLO si la navegación fue exitosa
    if (isSuccessfulNavigation && clearCart) {
      clearCart();
    }
  }, [clearCart, isSuccessfulNavigation]);

  if (!isSuccessfulNavigation) {
    return <Navigate to="/" />;
  }

  return (
    <div className="bg-white">
        <div className="container mx-auto text-center py-20 px-4">
            <svg className="w-24 h-24 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h1 className="text-4xl font-extrabold text-gray-800">¡Gracias por tu compra!</h1>
            <p className="mt-4 text-lg text-gray-600">Tu pedido ha sido recibido y está siendo procesado.</p>
            <p className="mt-2 text-gray-500">Recibirás una confirmación por correo electrónico en breve.</p>
            <Link to="/" className="mt-8 inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded-md hover:bg-blue-700 transition-transform transform hover:scale-105">
                Volver a la Tienda
            </Link>
        </div>
    </div>
  );
}
export default OrderConfirmationPage;
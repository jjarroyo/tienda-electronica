import { Link } from 'react-router-dom';
import { FaLaptopCode, FaShoppingCart, FaSearch } from 'react-icons/fa';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

function Navbar({ searchTerm, setSearchTerm }) {
  const { cartItems } = useContext(CartContext);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      {/* 1. Contenedor principal: ahora permite que los elementos se envuelvan (flex-wrap) */}
      <div className="container mx-auto px-4 sm:px-6 py-3 flex flex-wrap justify-between items-center">
        
        {/* Logo/Marca: Ocupa el primer lugar en el orden */}
        <Link to="/" className="flex items-center order-1">
          <FaLaptopCode className="text-2xl text-blue-600 mr-2" />
          <span className="text-xl font-bold text-gray-800">ElectroShop</span>
        </Link>

        {/* Icono del Carrito: 
            - En móvil, es el segundo elemento (a la derecha del logo).
            - En escritorio, es el tercer elemento (a la derecha del buscador). */}
        <Link to="/cart" className="relative text-gray-600 hover:text-blue-600 order-2 md:order-3">
          <FaShoppingCart className="text-2xl" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>

        {/* Barra de Búsqueda:
            - En móvil, es el tercer elemento y ocupa todo el ancho (w-full).
            - En escritorio, vuelve a ser el segundo elemento en el medio. */}
        <div className="relative w-full md:w-1/3 order-3 md:order-2 mt-3 md:mt-0">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <FaSearch className="text-gray-400" />
            </span>
            <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm transition-colors duration-200 ease-in-out hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Buscar productos..."
            />
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
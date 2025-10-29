import { Link, useNavigate } from 'react-router-dom';
import { FaLaptopCode, FaShoppingCart, FaSearch } from 'react-icons/fa';
import { useContext, useState, useEffect, useRef } from 'react';
import { CartContext } from '../context/CartContext';
import api from '../api/axiosConfig'; // Necesitamos api para buscar productos

function Navbar({
    searchTerm: initialSearchTerm = '',
    setSearchTerm: setGlobalSearchTerm = () => {},
    onMobileSearchClick,
}) {
    const { cartItems } = useContext(CartContext);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const navigate = useNavigate();
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false); // <-- NUEVO ESTADO

    // Estado local para el input de búsqueda
    const [localSearchTerm, setLocalSearchTerm] = useState(initialSearchTerm);
    // Estado para las sugerencias
    const [suggestions, setSuggestions] = useState([]);
    // Estado para mostrar/ocultar el dropdown
    const [showSuggestions, setShowSuggestions] = useState(false);
    // Ref para detectar clics fuera del área de búsqueda
    const searchRef = useRef(null);

    // Efecto para buscar sugerencias cuando el término cambia (con debounce)
    useEffect(() => {
        // Si no hay término, oculta sugerencias
        if (!localSearchTerm.trim()) {
            setSuggestions([]);
            setShowSuggestions(false);
            setIsLoadingSuggestions(false);
            return;
        }

        setIsLoadingSuggestions(true);
        setShowSuggestions(true);
        // Debounce: Espera 300ms después de que el usuario deja de escribir
        const delayDebounceFn = setTimeout(async () => {
            try {
                // Llama a la API para buscar productos que coincidan (ajusta el endpoint si es necesario)
                const res = await api.get(
                    `/productos?search=${localSearchTerm}`
                );
                setSuggestions(res.data.data.slice(0, 5)); // Muestra hasta 5 sugerencias
                setShowSuggestions(true);
            } catch (error) {
                console.error('Error fetching search suggestions:', error);
                setSuggestions([]);
                setShowSuggestions(false);
            } finally {
                setIsLoadingSuggestions(false);
            }
        }, 300);

        // Limpia el timeout si el usuario sigue escribiendo
        return () => clearTimeout(delayDebounceFn);
    }, [localSearchTerm]);

    // Efecto para cerrar sugerencias si se hace clic fuera
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target)
            ) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [searchRef]);

    const handleInputChange = (e) => {
        setLocalSearchTerm(e.target.value);
    };

    // Función para manejar la búsqueda completa (Enter o botón "Ver todos")
    const handleSearchSubmit = (e) => {
        e?.preventDefault(); // Previene recarga si es un form
        setGlobalSearchTerm(localSearchTerm); // Actualiza el término global
        setShowSuggestions(false); // Oculta sugerencias
        navigate(`/products?search=${encodeURIComponent(localSearchTerm)}`); // Navega al catálogo filtrado
    };

    // Función al hacer clic en una sugerencia
    const handleSuggestionClick = (productId) => {
        setLocalSearchTerm(''); // Limpia la búsqueda
        setShowSuggestions(false);
        navigate(`/product/${productId}`);
    };

    const apiEnv = import.meta.env.VITE_API_URL;
    const baseApiUrl = apiEnv
        ? apiEnv.replace('/api', '')
        : 'https://tienda-electronica-3grv.onrender.com';

    return (
        <nav className="bg-white shadow-md sticky top-0 z-40">
            {/* 1. Contenedor principal: ahora permite que los elementos se envuelvan (flex-wrap) */}
            <div className="container mx-auto px-4 sm:px-6 py-3 flex flex-wrap justify-between items-center">
                {/* Logo/Marca: Ocupa el primer lugar en el orden */}
                <Link to="/" className="flex items-center order-1">
                    <FaLaptopCode className="text-2xl text-blue-600 mr-2" />
                    <span className="text-xl font-bold text-gray-800">
                        ElectroShop
                    </span>
                </Link>

                <button
                    onClick={onMobileSearchClick} // Llama a la función del layout
                    className="p-2 text-gray-600 hover:text-blue-600 md:hidden order-2 ml-auto mr-4" // Se muestra hasta 'md', alineado
                    aria-label="Abrir búsqueda"
                >
                    <FaSearch className="text-xl" />
                </button>

                <Link
                    to="/cart"
                    className="relative text-gray-600 hover:text-blue-600 order-2 md:order-3"
                >
                    <FaShoppingCart className="text-2xl" />
                    {totalItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {totalItems}
                        </span>
                    )}
                </Link>

                {/* --- BARRA DE BÚSQUEDA CON SUGERENCIAS --- */}
                <div
                    ref={searchRef}
                    className="relative w-full md:w-1/2 order-3 md:order-2 mt-3 md:mt-0 hidden md:block"
                >
                    {/* Usamos un form para manejar Enter */}
                    <form onSubmit={handleSearchSubmit} className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </span>
                        <input
                            type="text"
                            value={localSearchTerm}
                            onChange={handleInputChange}
                            onFocus={() =>
                                localSearchTerm.trim() &&
                                setShowSuggestions(true)
                            } // Muestra al hacer foco si hay texto
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm transition-colors duration-200 ease-in-out hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Buscar productos..."
                        />
                    </form>

                    {/* Dropdown de Sugerencias */}
                    {showSuggestions && ( // Muestra el contenedor si showSuggestions es true
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                            {isLoadingSuggestions ? (
                                // --- ESTADO DE CARGA (SKELETON) ---
                                <div className="p-4 space-y-3 animate-pulse">
                                    {[...Array(3)].map(
                                        (
                                            _,
                                            i // Muestra 3 placeholders
                                        ) => (
                                            <div
                                                key={i}
                                                className="flex items-center space-x-3"
                                            >
                                                <div className="h-8 w-8 bg-gray-200 rounded"></div>
                                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : suggestions.length > 0 ? (
                                // --- ESTADO CON RESULTADOS ---
                                <ul>
                                    {suggestions.map((product) => (
                                        <li key={product.id}>
                                            <button
                                                onClick={() =>
                                                    handleSuggestionClick(
                                                        product.id
                                                    )
                                                }
                                                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-3"
                                            >
                                                {/* Imagen */}
                                                <img
                                                    src={`${baseApiUrl}${product.imagenUrl}`}
                                                    alt={product.nombre}
                                                    className="w-10 h-10 object-cover rounded flex-shrink-0" // Hice la imagen un poco más grande
                                                />
                                                {/* Nombre y Precio */}
                                                <div className="flex-grow overflow-hidden">
                                                    {' '}
                                                    {/* Contenedor para que el truncate funcione bien */}
                                                    <span className="block truncate text-sm text-gray-800">
                                                        {product.nombre}
                                                    </span>
                                                    {/* --- AÑADIR PRECIO AQUÍ --- */}
                                                    <span className="block text-sm font-bold text-blue-600">
                                                        $
                                                        {product.precio.toLocaleString(
                                                            'es-CO'
                                                        )}
                                                    </span>
                                                    {/* --- FIN DEL PRECIO --- */}
                                                </div>
                                            </button>
                                        </li>
                                    ))}
                                    {/* Botón "Ver todos" solo si hay texto y sugerencias */}
                                    {localSearchTerm.trim() && (
                                        <li>
                                            <button
                                                onClick={handleSearchSubmit}
                                                className="w-full text-center px-4 py-2 text-blue-600 font-semibold hover:bg-gray-100 border-t"
                                            >
                                                Ver todos los resultados para "
                                                {localSearchTerm}"
                                            </button>
                                        </li>
                                    )}
                                </ul>
                            ) : (
                                // --- ESTADO SIN RESULTADOS (y no cargando) ---
                                // Mostramos "No encontrado" solo si se escribió algo
                                localSearchTerm.trim() && (
                                    <div className="p-4 text-center text-gray-500">
                                        No se encontraron resultados.
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;

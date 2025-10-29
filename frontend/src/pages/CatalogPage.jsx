import { useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import FiltersSidebar from '../components/FiltersSidebar';
import { FaFilter } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { CartContext } from '../context/CartContext';
import { FaShoppingCart } from 'react-icons/fa';
import { Link, useSearchParams } from 'react-router-dom';
import { useSearchTerm } from '../components/PublicLayout'; // <-- Vuelve a importar esto

function CatalogPage() {
    // Estado para la lista COMPLETA de productos
    const [allProducts, setAllProducts] = useState([]);
    // Estado para la lista de productos que se MUESTRAN (filtrados)
    const [filteredProducts, setFilteredProducts] = useState([]);
    const { addToCart } = useContext(CartContext);
    const [loading, setLoading] = useState(true);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const initialCategory = searchParams.get('category') || '';
    const { searchTerm } = useSearchTerm();
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    // Cargar todos los productos una sola vez
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productsPromise = api.get('/productos');
                const categoriesPromise = api.get('/categories');
                const [productsRes, categoriesRes] = await Promise.all([
                    productsPromise,
                    categoriesPromise,
                ]);

                setAllProducts(productsRes.data.data);
                setFilteredProducts(productsRes.data.data);
                setCategories(categoriesRes.data.data);
            } catch (error) {
                console.error('Error al cargar productos:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Efecto para APLICAR TODOS LOS FILTROS
    useEffect(() => {
        // Empezamos siempre desde la lista completa
        let results = [...allProducts];

        // Variable para saber si se aplicó algún filtro
        let isFiltered = false;

        // 1. Filtrar por búsqueda (usando initialSearchTerm de la URL)
        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            results = results.filter((product) =>
                product.nombre.toLowerCase().includes(lowerSearchTerm)
            );
        }

        // 2. Filtrar por categoría
        if (selectedCategory) {
            results = results.filter(
                (product) => product.Category?.name === selectedCategory
            );
            isFiltered = true;
        }

        // 3. Filtrar por precio mínimo
        if (minPrice) {
            results = results.filter(
                (product) => product.precio >= parseFloat(minPrice)
            );
            isFiltered = true;
        }

        // 4. Filtrar por precio máximo
        if (maxPrice) {
            results = results.filter(
                (product) => product.precio <= parseFloat(maxPrice)
            );
            isFiltered = true;
        }

        console.log('¿Se aplicaron filtros?', isFiltered);
        setFilteredProducts(results);
    }, [searchTerm, selectedCategory, minPrice, maxPrice, allProducts]);

    const handleAddToCart = (e, product) => {
        e.preventDefault(); // Detiene la acción por defecto del <Link> (navegar)
        e.stopPropagation(); // Detiene la propagación del evento hacia el <Link>

        if (product.stock === 0) {
            toast.error('¡Este producto está agotado!');
            return;
        }

        addToCart(product, 1); // Añade 1 unidad por defecto
        toast.success(`${product.nombre} añadido al carrito!`);
    };

    const apiEnv = import.meta.env.VITE_API_URL;
    const baseApiUrl = apiEnv
        ? apiEnv.replace('/api', '')
        : 'https://tienda-electronica-3grv.onrender.com';

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className=" mx-auto p-4 sm:p-6 lg:p-8">
                {/* 2. BOTÓN PARA ABRIR FILTROS (SOLO VISIBLE EN MÓVIL) */}
                <button
                    onClick={() => setIsFiltersOpen(true)}
                    className="lg:hidden mb-4 w-full flex items-center justify-center gap-2 bg-white p-3 rounded-md shadow text-gray-700 font-semibold"
                >
                    <FaFilter />
                    Mostrar Filtros
                </button>

                <div className="flex flex-col lg:flex-row gap-8">
                    <FiltersSidebar
                        isOpen={isFiltersOpen}
                        onClose={() => setIsFiltersOpen(false)} // Pasamos la función para cerrar
                        // ... (el resto de las props que ya tenías)
                        categories={categories}
                        setSelectedCategory={setSelectedCategory}
                        setMinPrice={setMinPrice}
                        setMaxPrice={setMaxPrice}
                        selectedCategory={selectedCategory}
                    />

                    <main className="flex-1">
                        {loading ? (
                            <p>Cargando productos...</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredProducts.map((product) => (
                                    <Link
                                        to={`/product/${product.id}`}
                                        key={product.id}
                                    >
                                        <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 h-full flex flex-col">
                                            <img
                                                src={`${baseApiUrl}${product.imagenUrl}`}
                                                alt={product.nombre}
                                                className="w-full h-48 object-contain"
                                            />
                                            <div className="p-4 flex flex-col flex-grow">
                                                <h2 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                                                    {product.nombre}
                                                </h2>

                                                {/* 7. REEMPLAZA ESTE BLOQUE */}
                                                <div className="flex justify-between items-center mt-auto pt-4">
                                                    <span className="text-xl font-bold text-green-600">
                                                        $
                                                        {product.precio.toLocaleString(
                                                            'es-CO'
                                                        )}
                                                    </span>

                                                    {/* El span de stock se reemplaza por el botón */}
                                                    <button
                                                        onClick={(e) =>
                                                            handleAddToCart(
                                                                e,
                                                                product
                                                            )
                                                        }
                                                        disabled={
                                                            product.stock === 0
                                                        }
                                                        // CLASES ANTIGUAS (para el ícono): "bg-blue-600 text-white p-2 rounded-full ..."
                                                        // CLASES NUEVAS (para el botón ancho):
                                                        className="flex items-center gap-2
                            bg-blue-600 text-white text-sm font-semibold 
                            px-4 py-1 rounded-md 
                            hover:bg-blue-700 transition-colors 
                            disabled:bg-gray-400 disabled:cursor-not-allowed"
                                                        aria-label="Añadir al carrito"
                                                    >
                                                        Añadir
                                                        <FaShoppingCart />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                        {!loading && filteredProducts.length === 0 && (
                            <div className="text-center py-10 text-gray-500">
                                <h2 className="text-2xl">
                                    No se encontraron productos
                                </h2>
                                <p>Intenta ajustar tu búsqueda o filtros.</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default CatalogPage;

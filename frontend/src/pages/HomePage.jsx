import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import FiltersSidebar from '../components/FiltersSidebar'; 
import { FaFilter } from 'react-icons/fa';
import Navbar from '../components/Navbar';

function HomePage() {
  // Estado para la lista COMPLETA de productos
  const [allProducts, setAllProducts] = useState([]);
  // Estado para la lista de productos que se MUESTRAN (filtrados)
  const [filteredProducts, setFilteredProducts] = useState([]);
  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);


  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Cargar todos los productos una sola vez
 useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsPromise = api.get('/productos');
        const categoriesPromise = api.get('/categories');
        const [productsRes, categoriesRes] = await Promise.all([productsPromise, categoriesPromise]);

        setAllProducts(productsRes.data.data);
        setFilteredProducts(productsRes.data.data);        
        setCategories(categoriesRes.data.data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Efecto para APLICAR TODOS LOS FILTROS
  useEffect(() => {
    let results = [...allProducts];

    // 1. Filtrar por búsqueda
    if (searchTerm) {
      results = results.filter(product =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Filtrar por categoría
    if (selectedCategory) {
      results = results.filter(product => product.Category?.name === selectedCategory);
    }
    
    // 3. Filtrar por precio mínimo
    if (minPrice) {
      results = results.filter(product => product.precio >= parseFloat(minPrice));
    }
    
    // 4. Filtrar por precio máximo
    if (maxPrice) {
      results = results.filter(product => product.precio <= parseFloat(maxPrice));
    }

    setFilteredProducts(results);
  }, [searchTerm, selectedCategory, minPrice, maxPrice, allProducts]);

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
          />


        <main className="flex-1">
          {loading ? (
            <p>Cargando productos...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Link to={`/product/${product.id}`} key={product.id}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 h-full flex flex-col">
                    <img src={product.imagenUrl} alt={product.nombre} className="w-full h-48 object-cover" />
                    <div className="p-4 flex flex-col flex-grow">
                      <h2 className="text-lg font-semibold text-gray-900 mb-2 truncate">{product.nombre}</h2>
                      <div className="flex justify-between items-center mt-auto pt-4">
                        <span className="text-xl font-bold text-green-600">${product.precio}</span>
                        <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded-full">Stock: {product.stock}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-10 text-gray-500">
                <h2 className="text-2xl">No se encontraron productos</h2>
                <p>Intenta ajustar tu búsqueda o filtros.</p>
            </div>
          )}
        </main>
      </div>
    </div>
    </div>
  );
}

export default HomePage;
import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { CartContext } from '../context/CartContext';
import toast from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';

function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1); // Estado para la cantidad seleccionada
    const [activeTab, setActiveTab] = useState('description'); // Estado para las pestañas de info
    const { addToCart } = useContext(CartContext);
    const [addedMessage, setAddedMessage] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/productos/${id}`);
                setProduct(res.data.data);
                // Asegúrate de que la cantidad no exceda el stock si se recarga la página
                if (res.data.data.stock < quantity) {
                    setQuantity(res.data.data.stock > 0 ? 1 : 0);
                }
            } catch (error) {
                console.error('Error al cargar el producto:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        // Asegurarse de que la cantidad no sea menor que 1 y no exceda el stock disponible
        if (!isNaN(value) && value >= 1 && value <= product.stock) {
            setQuantity(value);
        } else if (value < 1) {
            setQuantity(1); // Valor mínimo 1
        } else if (value > product.stock) {
            setQuantity(product.stock); // No exceder el stock
        }
    };

    const handleAddToCart = () => {
        setIsAdding(true);
        addToCart(product, quantity);
        toast.success('¡Producto añadido al carrito!');
        toast.success('¡Producto añadido al carrito!');

        setTimeout(() => {
            setIsAdding(false); // Desactiva el estado de carga
        }, 500);
    };

    if (loading) {
        return <div className="text-center py-10">Cargando...</div>;
    }

    if (!product) {
        return <div className="text-center py-10">Producto no encontrado.</div>;
    }

    const apiEnv = import.meta.env.VITE_API_UR;
    const baseApiUrl = apiEnv
        ? apiEnv.replace('/api', '')
        : 'https://tienda-electronica-3grv.onrender.com';

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto p-4 sm:p-8">
                <Link
                    to="/"
                    className="text-blue-600 hover:underline mb-6 inline-flex items-center"
                >
                    <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        ></path>
                    </svg>
                    Volver a la tienda
                </Link>

                {/* Sección principal del producto: Imagen y Detalles */}
                <div className="bg-white rounded-lg shadow-lg p-6 lg:p-10 flex flex-col lg:flex-row gap-8">
                    {/* Columna de Imágenes (por ahora una sola) */}
                    <div className="lg:w-1/2 flex flex-col items-center">
                        {/* Imagen Principal */}
                        <img
                            src={`${baseApiUrl}${product.imagenUrl}`}
                            alt={product.nombre}
                            className="w-full h-96 object-contain rounded-lg shadow-md bg-gray-50 mb-4"
                        />
                        {/* Futuro: Carrusel de miniaturas aquí */}
                        {/* <div className="flex space-x-2 mt-2">
                <img src={product.imagenUrl} alt="Thumbnail 1" className="w-20 h-20 object-cover rounded border-2 border-blue-500 cursor-pointer" />
                <img src="https://via.placeholder.com/80" alt="Thumbnail 2" className="w-20 h-20 object-cover rounded border border-gray-300 cursor-pointer" />
            </div> */}
                    </div>

                    {/* Columna de Detalles del Producto */}
                    <div className="lg:w-1/2 lg:pl-8 flex flex-col justify-between">
                        <div>
                            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                                {product.nombre}
                            </h1>
                            <p className="text-2xl font-bold text-green-600 mb-6">
                                ${product.precio}
                            </p>

                            {/* Opciones de Compra */}
                            <div className="flex items-center mb-6 space-x-4">
                                <label
                                    htmlFor="quantity"
                                    className="text-lg font-medium text-gray-700"
                                >
                                    Cantidad:
                                </label>
                                <input
                                    type="number"
                                    id="quantity"
                                    min="1"
                                    max={product.stock}
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    className="w-24 p-2 border border-gray-300 rounded-md text-center text-lg focus:ring-blue-500 focus:border-blue-500"
                                    disabled={product.stock === 0} // Deshabilitar si no hay stock
                                />
                                <span className="text-gray-500 text-sm">
                                    ({product.stock} en stock)
                                </span>
                            </div>

                            {product.stock === 0 && (
                                <p className="text-red-600 text-lg font-semibold mb-4">
                                    ¡Producto agotado!
                                </p>
                            )}

                            <button
                                onClick={handleAddToCart}
                                className={`w-full flex justify-center items-center text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 ${
                                    isAdding || product.stock === 0
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                                disabled={isAdding || product.stock === 0}
                            >
                                {isAdding ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2" />
                                        Añadiendo...
                                    </>
                                ) : (
                                    'Añadir al Carrito'
                                )}
                            </button>
                        </div>
                        {/* Puedes añadir más detalles como rating, marca, etc. aquí si los tuvieras */}
                    </div>
                </div>

                {/* Sección de Información Adicional (Pestañas) */}
                <div className="bg-white rounded-lg shadow-lg mt-8 p-6 lg:p-10">
                    <div className="border-b border-gray-200">
                        <nav
                            className="-mb-px flex space-x-8"
                            aria-label="Tabs"
                        >
                            <button
                                onClick={() => setActiveTab('description')}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${
                                    activeTab === 'description'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Descripción
                            </button>
                            {/*  <button
                onClick={() => setActiveTab('details')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${activeTab === 'details' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Especificaciones
              </button> */}
                        </nav>
                    </div>
                    <div className="mt-6 text-gray-800">
                        {activeTab === 'description' && (
                            <p>{product.descripcion}</p>
                        )}
                        {/*  {activeTab === 'details' && (
              <div>
                <h3 className="text-xl font-semibold mb-3">Detalles Técnicos (Ejemplo)</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Peso: 200g</li>
                  <li>Dimensiones: 10x5x2 cm</li>
                  <li>Material: Aleación de aluminio</li>
                  <li>Garantía: 1 año</li>
                </ul>
                <p className="mt-4 text-gray-600">
                    Puedes añadir más detalles técnicos del producto aquí. Para esto, necesitaríamos añadir más campos al modelo de producto en el backend.
                </p>
              </div>
            )} */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetailPage;

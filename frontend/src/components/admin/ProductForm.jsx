import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import toast from 'react-hot-toast';
// El componente recibe el producto a editar (si existe) y el texto para el botón
function ProductForm({ productToEdit, buttonText }) {
    const [categories, setCategories] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [product, setProduct] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        imagenUrl: '',
        CategoryId: '',
    });
    const [message, setMessage] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Si nos pasan un producto para editar, llenamos el formulario con sus datos
    useEffect(() => {
        if (productToEdit) {
            setProduct(productToEdit);
            if (productToEdit.imagenUrl) {
                // CONSTRUYE LA URL COMPLETA
                // Asume que VITE_API_URL es algo como http://localhost:5000/api
                // Necesitamos quitar el /api para acceder a /public
                const baseApiUrl =
                    import.meta.env.VITE_API_UR.replace('/api', '') ||
                    'https://tienda-electronica-3grv.onrender.com';
                setImagePreview(baseApiUrl + productToEdit.imagenUrl);
            }
        }
    }, [productToEdit]);

    useEffect(() => {
        const fetchCategories = async () => {
            const token = localStorage.getItem('token');
            const res = await api.get('/admin/categories', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCategories(res.data.data);
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            // Crear previsualización local
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImageFile(null);
            // Si se cancela, vuelve a la imagen original si se está editando
            if (productToEdit?.imagenUrl) {
                const baseApiUrl = import.meta.env.VITE_API_URL.replace(
                    '/api',
                    ''
                );
                setImagePreview(baseApiUrl + productToEdit.imagenUrl);
            } else {
                setImagePreview(null);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Crear FormData para enviar archivos y texto
        const formData = new FormData();
        formData.append('nombre', product.nombre);
        formData.append('descripcion', product.descripcion);
        formData.append('precio', product.precio);
        formData.append('stock', product.stock);
        formData.append('CategoryId', product.CategoryId);

        // Añade el archivo solo si se seleccionó uno nuevo
        if (imageFile) {
            formData.append('image', imageFile);
        } else if (!productToEdit) {
            // Si es creación y no hay imagen,  toast.error( error
            toast.error('Debes seleccionar una imagen para crear el producto.');
            return;
        }

        try {
            if (productToEdit) {
                // Actualizar (PUT) - Usa la ruta de admin
                await api.put(`/admin/products/${productToEdit.id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data', // Axios lo infiere, pero es bueno saberlo
                    },
                });
            } else {
                // Crear (POST) - Usa la ruta de admin
                await api.post('/admin/products', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }
            toast.success(
                `Producto ${
                    productToEdit ? 'actualizado' : 'creado'
                } con éxito!`
            );
            navigate('/admin/products');
        } catch (error) {
            toast.error(
                `Error al ${
                    productToEdit ? 'actualizar' : 'crear'
                } el producto.`
            );
            console.error(error);
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">
                {productToEdit ? 'Editar Producto' : 'Crear Nuevo Producto'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Nombre
                    </label>
                    <input
                        type="text"
                        name="nombre"
                        value={product.nombre}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Descripción
                    </label>
                    <textarea
                        name="descripcion"
                        value={product.descripcion}
                        onChange={handleChange}
                        required
                        rows="3"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Precio
                    </label>
                    <input
                        type="number"
                        name="precio"
                        value={product.precio}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Stock
                    </label>
                    <input
                        type="number"
                        name="stock"
                        value={product.stock}
                        onChange={handleChange}
                        required
                        min="0"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Imagen del Producto
                    </label>
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Previsualización"
                            className="mt-2 h-32 w-auto object-contain rounded border p-1"
                        />
                    )}
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        required={!productToEdit}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Categoría
                    </label>
                    <select
                        name="CategoryId"
                        value={product.CategoryId || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border bg-white rounded-md"
                        required
                    >
                        <option value="" disabled>
                            Selecciona una categoría
                        </option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/products')}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        {buttonText}
                    </button>
                </div>
                {message && (
                    <p className="mt-4 text-center text-red-600">{message}</p>
                )}
            </form>
        </div>
    );
}

export default ProductForm;

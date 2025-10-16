import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';


// El componente recibe el producto a editar (si existe) y el texto para el botón
function ProductForm({ productToEdit, buttonText }) {
  const [categories, setCategories] = useState([]); 
  const [product, setProduct] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    imagenUrl: '',
    CategoryId: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Si nos pasan un producto para editar, llenamos el formulario con sus datos
  useEffect(() => {
    if (productToEdit) {
      setProduct(productToEdit);
    }
  }, [productToEdit]);

  useEffect(() => {
    const fetchCategories = async () => {
        const token = localStorage.getItem('token');
        const res = await api.get('/admin/categories', { headers: { Authorization: `Bearer ${token}` } });
        setCategories(res.data.data);
    };
    fetchCategories();
}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (productToEdit) {
        // Lógica para ACTUALIZAR (PUT)
        await api.put(`http://localhost:5000/api/productos/${productToEdit.id}`, product, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Lógica para CREAR (POST)
        await api.post('http://localhost:5000/api/productos', product, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      // Si todo sale bien, volvemos a la lista de productos
      navigate('/admin/products');
    } catch (error) {
      setMessage(`Error al ${productToEdit ? 'actualizar' : 'crear'} el producto.`);
      console.error(error);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">{productToEdit ? 'Editar Producto' : 'Crear Nuevo Producto'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input type="text" name="nombre" value={product.nombre} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea name="descripcion" value={product.descripcion} onChange={handleChange} required rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Precio</label>
          <input type="number" name="precio" value={product.precio} onChange={handleChange} required min="0" step="0.01" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Stock</label>
          <input type="number" name="stock" value={product.stock} onChange={handleChange} required min="0" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">URL de la Imagen</label>
          <input type="text" name="imagenUrl" value={product.imagenUrl} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Categoría</label>
            <select 
                name="CategoryId" 
                value={product.CategoryId || ''} 
                onChange={handleChange} 
                className="mt-1 block w-full p-2 border bg-white rounded-md"
                required
            >
                <option value="" disabled>Selecciona una categoría</option>
                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>
        </div>
        <div className="flex justify-end space-x-4">
            <button type="button" onClick={() => navigate('/admin/products')} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">
                Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                {buttonText}
            </button>
        </div>
        {message && <p className="mt-4 text-center text-red-600">{message}</p>}
      </form>
    </div>
  );
}

export default ProductForm;
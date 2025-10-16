import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Link } from 'react-router-dom';
import { MdEdit, MdDelete } from 'react-icons/md';

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await api.get('http://localhost:5000/api/productos');
      setProducts(res.data.data);
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await api.delete(`http://localhost:5000/api/productos/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        console.error("Error al eliminar el producto", error);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Productos</h1>
        <Link to="/admin/products/create" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Crear Producto
        </Link>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Producto</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Precio</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
                <tr>
                {/* Colspan="4" hace que esta celda ocupe el ancho de 4 columnas */}
                <td colSpan="4" className="text-center py-10 text-gray-500">
                    Aún no hay productos creados.
                </td>
                </tr>
            ) : (
                products.map(product => (
                <tr key={product.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{product.nombre}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">${product.precio}</td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{product.stock}</td>
                   <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm flex items-center justify-end space-x-4">
                    <Link to={`/admin/products/edit/${product.id}`} className="text-yellow-600 hover:text-yellow-900">
                      <MdEdit size={20} />
                    </Link>
                    
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">
                      <MdDelete size={20} />
                    </button>
                  </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductListPage;
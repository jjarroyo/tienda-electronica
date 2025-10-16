import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa';

function AdminCategoryListPage() {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const token = localStorage.getItem('token');

  const fetchCategories = async () => {
    const res = await api.get('/admin/categories', { headers: { Authorization: `Bearer ${token}` } });
    setCategories(res.data.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/categories', { name: newCategoryName }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Categoría creada');
      setNewCategoryName('');
      fetchCategories();
    } catch (error) {
      toast.error('Error al crear la categoría.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro? Se desasignará de todos los productos.')) {
      try {
        await api.delete(`/admin/categories/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        toast.success('Categoría eliminada');
        fetchCategories();
      } catch (error) {
        toast.error('Error al eliminar.');
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestión de Categorías</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulario de creación */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Crear Nueva Categoría</h2>
          <form onSubmit={handleCreate}>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nombre de la categoría"
              className="w-full p-2 border rounded-md"
              required
            />
            <button type="submit" className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
              Guardar
            </button>
          </form>
        </div>
        {/* Lista de categorías */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Categorías Existentes</h2>
          <ul className="space-y-2">
            {categories.map(cat => (
              <li key={cat.id} className="flex justify-between items-center p-2 border rounded-md">
                <span>{cat.name}</span>
                <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:text-red-700"><FaTrash /></button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
export default AdminCategoryListPage;
import { useState } from 'react';
import axios from 'axios';

function ProductForm() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProduct = { nombre, descripcion, precio: parseFloat(precio), stock: parseInt(stock), imagenUrl };
    const token = localStorage.getItem('token');

    try {
      await axios.post('/api/productos', newProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('¡Producto creado con éxito!');
      // Limpiar formulario
      setNombre(''); setDescripcion(''); setPrecio(''); setStock(''); setImagenUrl('');
    } catch (error) {
      setMessage('Error al crear el producto.');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Añadir Nuevo Producto</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ... Campos del formulario ... */}
        <input type="text" placeholder="Nombre del producto" value={nombre} onChange={e => setNombre(e.target.value)} required className="w-full p-2 border rounded" />
        <textarea placeholder="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)} required className="w-full p-2 border rounded" />
        <input type="number" placeholder="Precio" value={precio} onChange={e => setPrecio(e.target.value)} required className="w-full p-2 border rounded" />
        <input type="number" placeholder="Stock" value={stock} onChange={e => setStock(e.target.value)} required className="w-full p-2 border rounded" />
        <input type="text" placeholder="URL de la Imagen" value={imagenUrl} onChange={e => setImagenUrl(e.target.value)} required className="w-full p-2 border rounded" />
        <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700">
          Crear Producto
        </button>
        {message && <p className="mt-4 text-center">{message}</p>}
      </form>
    </div>
  );
}

export default ProductForm;
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axiosConfig'; 
import ProductForm from '../components/admin/ProductForm';

function ProductEditPage() {
  const { id } = useParams(); // Obtenemos el ID del producto de la URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`http://localhost:5000/api/productos/${id}`);
        setProduct(res.data.data);
      } catch (error) {
        console.error("Error al cargar el producto", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <p>Cargando producto...</p>;
  if (!product) return <p>Producto no encontrado.</p>;

  // Le pasamos el producto encontrado al formulario para que se llene.
  return <ProductForm productToEdit={product} buttonText="Guardar Cambios" />;
}

export default ProductEditPage;
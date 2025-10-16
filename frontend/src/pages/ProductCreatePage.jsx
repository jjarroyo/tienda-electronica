import ProductForm from '../components/admin/ProductForm';

function ProductCreatePage() {
  // No le pasamos producto, así que el formulario estará vacío.
  return <ProductForm buttonText="Crear Producto" />;
}

export default ProductCreatePage;
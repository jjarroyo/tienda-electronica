import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-700 text-gray-300 py-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Columna 1: Logo y Descripción */}
        <div className="md:col-span-1">
          <h3 className="text-2xl font-bold text-white mb-4">ElectroShop</h3>
          <p className="text-sm">Tu destino ideal para la mejor tecnología. Calidad, innovación y servicio en cada compra.</p>
          <div className="flex space-x-4 mt-6">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300"><FaFacebookF size={20} /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300"><FaTwitter size={20} /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300"><FaInstagram size={20} /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300"><FaLinkedinIn size={20} /></a>
          </div>
        </div>

        {/* Columna 2: Navegación Rápida */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Navegación</h4>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-white transition-colors duration-300">Inicio</Link></li>
            <li><Link to="/products" className="hover:text-white transition-colors duration-300">Catálogo</Link></li>
            <li><Link to="/cart" className="hover:text-white transition-colors duration-300">Carrito</Link></li>
            <li><Link to="/admin/login" className="hover:text-white transition-colors duration-300">Admin</Link></li>
          </ul>
        </div>

        {/* Columna 3: Información y Políticas */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Información</h4>
          <ul className="space-y-2">
            <li><Link to="/privacy-policy" className="hover:text-white transition-colors duration-300">Política de Privacidad</Link></li>
            <li><Link to="/terms-and-conditions" className="hover:text-white transition-colors duration-300">Términos y Condiciones</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors duration-300">Contacto</Link></li> {/* Puedes crear esta página después */}
          </ul>
        </div>

        {/* Columna 4: Suscríbete (Ejemplo) */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Mantente Informado</h4>
          <p className="text-sm mb-4">Recibe las últimas noticias y ofertas.</p>
          <form className="flex">
            <input 
              type="email" 
              placeholder="Tu email" 
              className="p-2 rounded-l-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow text-gray-900" 
            />
            <button type="submit" className="bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700 transition-colors duration-300">
              Enviar
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400">
        <p>&copy; {currentYear} ElectroShop. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
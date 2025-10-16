import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { FaUserCircle } from 'react-icons/fa';

function Header() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data.data);
      } catch (error) {
        console.error("No se pudo obtener la información del usuario", error);
      }
    };
    if (token) {
      fetchUser();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <div>
        {/* Espacio para un futuro buscador o título de la página */}
      </div>
      <div className="relative">
        <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2">
          <FaUserCircle size={24} className="text-gray-600" />
          <span className="text-gray-800 font-medium">{user ? user.email : 'Cargando...'}</span>
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
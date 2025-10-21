import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { FaSearch, FaTimes } from 'react-icons/fa';

// Recibe props del PublicLayout
function MobileSearchOverlay({ isOpen, onClose, searchTerm, setSearchTerm }) {
  // Estado local para el input dentro del overlay
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null); // Ref para enfocar el input al abrir

  // Enfocar el input cuando el overlay se abre
  useEffect(() => {
    if (isOpen) {
      // Pequeño delay para asegurar que el input sea visible antes de enfocar
      setTimeout(() => inputRef.current?.focus(), 100);
      setLocalSearchTerm(''); // Limpia el término al abrir
      setSuggestions([]);   // Limpia sugerencias
    }
  }, [isOpen]);

  // Lógica para buscar sugerencias (similar a Navbar)
  useEffect(() => {
    if (!localSearchTerm.trim()) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await api.get(`/productos?search=${localSearchTerm}`);
        setSuggestions(res.data.data.slice(0, 10)); // Más sugerencias en móvil
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [localSearchTerm]);

  // Navegar a la página de resultados
  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (!localSearchTerm.trim()) return;
    setSearchTerm(localSearchTerm); // Actualiza el término global (opcional)
    onClose(); // Cierra el overlay
    navigate(`/products?search=${encodeURIComponent(localSearchTerm)}`);
  };

  // Navegar a la página de detalle
  const handleSuggestionClick = (productId) => {
    onClose(); // Cierra el overlay
    navigate(`/product/${productId}`);
  };

  // Si no está abierto, no renderiza nada
  if (!isOpen) {
    return null;
  }

  return (
    // Contenedor principal del overlay
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Barra superior con input y botón Cancelar */}
      <div className="flex items-center p-3 border-b border-gray-200 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="relative flex-grow mr-3">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </span>
          <input
            ref={inputRef}
            type="search" // Usar tipo search para mejor UX móvil (botón X)
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="¿Qué estás buscando?"
            autoComplete="off"
          />
        </form>
        <button
          onClick={onClose}
          className="text-blue-600 font-medium text-base flex-shrink-0"
        >
          Cancelar
        </button>
      </div>

      {/* Área de resultados/sugerencias */}
      <div className="flex-grow overflow-y-auto p-4">
        {isLoading ? (
          // Skeleton loader (simplificado)
          <div className="space-y-4 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-6 bg-gray-200 rounded w-3/4"></div>
            ))}
          </div>
        ) : suggestions.length > 0 ? (
          // Lista de sugerencias
          <ul className="divide-y divide-gray-100">
            {suggestions.map((product) => (
              <li key={product.id}>
                <button
                  onClick={() => handleSuggestionClick(product.id)}
                  className="w-full text-left py-3 flex items-center gap-3 hover:bg-gray-50"
                >
                  <img src={product.imagenUrl} alt="" className="w-10 h-10 object-cover rounded flex-shrink-0"/>
                  <div className="flex-grow overflow-hidden">
                    <span className="block truncate text-base text-gray-800">{product.nombre}</span>
                    <span className="block text-sm font-bold text-blue-600">${product.precio.toLocaleString('es-CO')}</span>
                  </div>
                </button>
              </li>
            ))}
            {/* Botón "Ver todos" */}
             {localSearchTerm.trim() && (
                 <li>
                    <button
                        onClick={handleSearchSubmit}
                        className="w-full text-center py-3 text-blue-600 font-semibold hover:bg-gray-50 border-t"
                    >
                        Ver todos los resultados
                    </button>
                 </li>
             )}
          </ul>
        ) : (
          // Mensaje "No encontrado" (solo si se buscó algo)
          localSearchTerm.trim() && !isLoading && (
            <div className="text-center text-gray-500 mt-10">
              <p>No se encontraron resultados para "{localSearchTerm}".</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default MobileSearchOverlay;
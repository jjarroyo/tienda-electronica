import { FaTimes } from 'react-icons/fa';

function FiltersSidebar({ isOpen, onClose, categories = [], setSelectedCategory, setMinPrice, setMaxPrice, selectedCategory }) {

  // Contenido de los filtros (lo reutilizaremos en ambas vistas)
  const FilterContent = () => (
    <>
      {/* Filtro por Categoría */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2">Categoría</h4>
        <ul className="space-y-2 text-sm">
          <li>
            <button 
              onClick={() => { setSelectedCategory(''); onClose(); }} 
              className={`text-gray-700 hover:text-blue-600 ${!selectedCategory ? 'font-bold text-blue-600' : ''}`}
            >
              Todas
            </button>
          </li>
          {categories.map(category => (
            <li key={category.id}>
              <button 
                onClick={() => { setSelectedCategory(category.name); onClose(); }} 
                className={`text-gray-700 hover:text-blue-600 capitalize ${selectedCategory === category.name ? 'font-bold text-blue-600' : ''}`}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Filtro por Precio */}
      <div>
        <h4 className="font-semibold mb-2">Precio</h4>
        <div className="flex flex-col space-y-2">
          <input type="number" placeholder="Mínimo" onChange={(e) => setMinPrice(e.target.value)} className="w-full p-2 border rounded-md text-sm" />
          <input type="number" placeholder="Máximo" onChange={(e) => setMaxPrice(e.target.value)} className="w-full p-2 border rounded-md text-sm" />
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* --- VERSIÓN MÓVIL (Menú deslizable) --- */}
      {/* Solo se muestra en pantallas pequeñas (hasta 'lg') */}
      <div className="lg:hidden">
        {/* Overlay */}
        <div 
          onClick={onClose}
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        />
        {/* Contenido del Sidebar */}
        <div className={`fixed top-0 left-0 h-full w-72 z-50 transform bg-white p-6 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="font-bold text-lg">Filtros</h3>
              <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
                  <FaTimes size={20} />
              </button>
          </div>
          <FilterContent />
        </div>
      </div>

      {/* --- VERSIÓN ESCRITORIO (Columna Fija) --- */}
      {/* Oculto por defecto, visible a partir de 'lg' */}
      <aside className="hidden lg:block w-64 bg-white p-6 rounded-lg shadow-md flex-shrink-0 self-start">
        <h3 className="font-bold text-lg mb-4 border-b pb-2">Filtros</h3>
        <FilterContent />
      </aside>
    </>
  );
}

export default FiltersSidebar;
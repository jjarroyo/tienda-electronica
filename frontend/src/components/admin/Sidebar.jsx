import { NavLink } from 'react-router-dom';
import { MdDashboard, MdShoppingBag,MdListAlt, MdCategory } from 'react-icons/md';

function Sidebar() {
  const linkClasses = "flex items-center p-3 my-1 rounded-lg text-gray-200 hover:bg-gray-700";
  const activeLinkClasses = "bg-gray-700";

  return (
    <aside className="w-64 bg-gray-800 text-white flex-shrink-0">
      <div className="p-4 text-2xl font-bold">Mi Tienda</div>
      <nav className="p-2">
        <NavLink to="/admin/dashboard" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <MdDashboard className="mr-3" /> Dashboard
        </NavLink>
        <NavLink to="/admin/products" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <MdShoppingBag className="mr-3" /> Productos
        </NavLink>
        <NavLink to="/admin/orders" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <MdListAlt className="mr-3" /> Órdenes
        </NavLink>
        <NavLink to="/admin/categories"  className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
        <MdCategory className="mr-3" /> Categorías  
      </NavLink>
      </nav>
    </aside>
  );
}
export default Sidebar;
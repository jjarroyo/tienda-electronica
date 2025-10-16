import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header'; 

function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-8">
          <Outlet /> {/* Aquí se renderizarán las páginas hijas */}
        </div>
      </main>
    </div>
  );
}
export default AdminLayout;
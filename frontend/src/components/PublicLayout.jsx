import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';

function PublicLayout() {
  return (
    <div>
        <Toaster position="bottom-center" />
        <Navbar />
        <main>
            <Outlet /> 
        </main>
    </div>
  );
}

export default PublicLayout;
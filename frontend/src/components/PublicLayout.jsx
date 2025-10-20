import { Outlet, useOutletContext } from 'react-router-dom';
import Navbar from './Navbar'; 
import Footer from './Footer'; 
import { useState } from 'react';

function PublicLayout() {
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <div className="flex flex-col min-h-screen">     
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <main className="flex-grow">
        <Outlet context={{ searchTerm }} />
      </main>
      <Footer />
    </div>
  );
}

export function useSearchTerm() {
  return useOutletContext();
}
export default PublicLayout;
import { Outlet, useOutletContext } from 'react-router-dom';
import Navbar from './Navbar'; 
import Footer from './Footer'; 
import { useState } from 'react';
import MobileSearchOverlay from './MobileSearchOverlay';
function PublicLayout() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
  const openMobileSearch = () => setIsMobileSearchActive(true);
  const closeMobileSearch = () => setIsMobileSearchActive(false);
  return (
    <div className="flex flex-col min-h-screen">     
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onMobileSearchClick={openMobileSearch}/>
      <main className="flex-grow">
        <Outlet context={{ searchTerm }} />
      </main>
      <Footer />
      <MobileSearchOverlay
        isOpen={isMobileSearchActive}
        onClose={closeMobileSearch}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </div>
  );
}

export function useSearchTerm() {
  return useOutletContext();
}
export default PublicLayout;
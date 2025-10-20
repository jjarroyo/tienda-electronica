import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

function RootLayout() {
  return (
    <>
      <Toaster position="bottom-center" />
      <Outlet />
    </>
  );
}

export default RootLayout;
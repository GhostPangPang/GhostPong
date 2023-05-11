import { Outlet } from 'react-router-dom';
import { Footer } from '../Footer';

export const FooterLayout = () => {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  );
};

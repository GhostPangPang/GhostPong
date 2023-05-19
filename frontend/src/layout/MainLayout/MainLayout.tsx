import { Content } from '../Content';
import { Header } from '../Header';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
  return (
    <>
      <Header />
      <Content>
        <Suspense fallback={<></>}>
          <Outlet />
        </Suspense>
      </Content>
    </>
  );
};

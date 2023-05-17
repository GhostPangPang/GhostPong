import { SocketHandler } from '../..//SocketHandler';
import { Content } from '../Content';
import { Header } from '../Header';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
  return (
    <>
      <SocketHandler />
      <Header />
      <Content>
        <Suspense fallback={<></>}>
          <Outlet />
        </Suspense>
      </Content>
    </>
  );
};

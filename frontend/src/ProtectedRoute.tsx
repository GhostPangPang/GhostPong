import { Outlet } from 'react-router-dom';
import { SocketHandler } from './SocketHandler';
import { useAuth } from '@/hooks';

export const ProtectedRoute = () => {
  const { auth } = useAuth();

  if (!auth) return null;
  else
    return (
      <>
        <SocketHandler />
        <Outlet />
      </>
    );
};

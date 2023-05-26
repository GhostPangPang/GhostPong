import { Outlet, useNavigate } from 'react-router-dom';
import { getAccessToken } from './libs/api/auth';
import { useLayoutEffect } from 'react';
import { SocketHandler } from './SocketHandler';

export const AuthChecker = () => {
  const navigate = useNavigate();
  const token = getAccessToken();

  useLayoutEffect(() => {
    if (!token) {
      navigate('/pre');
    }
  }, [token]);

  return (
    <>
      <SocketHandler />
      <Outlet />
    </>
  );
};

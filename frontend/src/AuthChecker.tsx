import { Outlet, useNavigate } from 'react-router-dom';
import { getAccessToken } from './libs/api/auth';
import { useEffect, useState } from 'react';
import { SocketHandler } from './SocketHandler';

export const AuthChecker = () => {
  const navigate = useNavigate();
  const token = getAccessToken();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if (token) setIsAuth(true);
  }, []);

  useEffect(() => {
    if (isAuth === false) navigate('/pre');
  }, [isAuth]);

  if (isAuth === false) return <></>;
  return (
    <>
      <SocketHandler />
      <Outlet />
    </>
  );
};

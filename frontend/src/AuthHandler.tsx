import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { setAccessToken } from './libs/api/auth';

export const AuthHandler = () => {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get('token');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('AuthHandler', token);
    if (token) setAccessToken(token);
  }, []);

  useEffect(() => {
    if (token) {
      navigate('/');
    }
    if (!token) {
      navigate('/pre');
    }
  }, [token]);

  return <></>;
};

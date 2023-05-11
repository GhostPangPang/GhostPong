import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { setAccessToken } from './libs/api/auth';

export const AuthHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');

    if (token) {
      setAccessToken(token);
      window.location.replace('/');
    } else {
      console.log('navigate to /pre');
      navigate('/pre', { replace: true });
    }
  }, []);

  return <></>;
};

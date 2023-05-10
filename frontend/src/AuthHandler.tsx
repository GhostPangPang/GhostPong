import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const AuthHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');

    console.log(urlParams);
    if (token) {
      // Store the access token in the app (state, context, local storage, etc.)
      // Here, we're just logging it
      console.log('Access Token: ', token);

      // Redirect user to another route after successful authentication
      navigate('/home');
    } else {
      // Handle the case where no token was returned or an error occurred
      console.error('No access token found or error occurred.');
      navigate('/error');
    }
  }, [location, navigate]);

  return (
    <div>
      <h2>Processing authentication...</h2>
    </div>
  );
};

import { localStorageKeys } from '@/constants';

const isDev = import.meta.env.MODE === 'development';
const storage = isDev ? sessionStorage : localStorage;

export const getAccessToken = () => {
  const key = localStorageKeys.accessToken;
  return storage.getItem(key);
};

export const setAccessToken = (token: string) => {
  const key = localStorageKeys.accessToken;
  storage.setItem(key, token);
};

export const removeAccessToken = () => {
  const key = localStorageKeys.accessToken;
  storage.removeItem(key);
};

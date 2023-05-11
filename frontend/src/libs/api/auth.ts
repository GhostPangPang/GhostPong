import { localStorageKeys } from '@/constants';

export const getAccessToken = () => {
  const key = localStorageKeys.accessToken;
  return localStorage.getItem(key);
};

export const setAccessToken = (token: string) => {
  const key = localStorageKeys.accessToken;
  localStorage.setItem(key, token);
};

export const removeAccessToken = () => {
  const key = localStorageKeys.accessToken;
  localStorage.removeItem(key);
};

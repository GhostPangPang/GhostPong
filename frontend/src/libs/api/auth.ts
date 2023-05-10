import { localStorageKeys } from '@/constants';

export const getAccessToken = () => {
  const key = localStorageKeys.accessToken;
  return localStorage.getItem(key);
};

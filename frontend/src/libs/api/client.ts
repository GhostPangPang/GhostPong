import axios from 'axios';

const createAxiosInstance = () => {
  const isDev = import.meta.env.DEV;
  const headers = isDev ? { 'x-my-id': '1' } : { Authorization: 'Bearer <token>' };

  return axios.create({ baseURL: import.meta.env.VITE_API_URL, headers, timeout: 100000, withCredentials: true });
};

export const client = createAxiosInstance();

export const get = <T>(...args: Parameters<typeof client.get>) => {
  return client.get<T, T>(...args);
};

export const post = <T>(...args: Parameters<typeof client.post>) => {
  return client.post<T, T>(...args);
};

export const patch = <T>(...args: Parameters<typeof client.patch>) => {
  return client.patch<T, T>(...args);
};

export const put = <T>(...args: Parameters<typeof client.put>) => {
  return client.put<T, T>(...args);
};

export const del = <T>(...args: Parameters<typeof client.delete>) => {
  return client.delete<T, T>(...args);
};

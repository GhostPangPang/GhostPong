import axios, { AxiosResponse } from 'axios';

const createAxiosInstance = () => {
  const isDev = import.meta.env.DEV;
  const headers = isDev ? { 'x-my-id': '1' } : { Authorization: 'Bearer <token>' };

  return axios.create({ baseURL: import.meta.env.VITE_API_URL, headers, timeout: 100000, withCredentials: true });
};

const responseInterceptor = (res: AxiosResponse) => {
  if (res.status >= 200 && res.status < 300) {
    return res.data;
  }
  return Promise.reject(res.data);
};

export const client = createAxiosInstance();
client.interceptors.response.use(responseInterceptor);
// 여기서 auth req interceptor 로 customAuthError 발생시키기 -> ErrorBoundary 에서 해결

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

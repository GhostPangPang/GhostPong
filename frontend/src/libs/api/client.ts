import axios, { AxiosError, AxiosResponse } from 'axios';
import { getAccessToken } from './auth';

const createAxiosInstance = () => {
  const isDev = import.meta.env.MODE === 'development';
  const token = getAccessToken();
  const headers = isDev ? { 'x-my-id': token ?? '1' } : token ? { Authorization: `Bearer ${token}` } : {};

  return axios.create({ baseURL: import.meta.env.VITE_API_URL, headers, timeout: 100000, withCredentials: true });
};

const responseInterceptor = (res: AxiosResponse) => {
  if (res.status === 201) {
    return { message: res.data.message, location: res.headers.location };
  } else if (res.status >= 200 && res.status < 300) {
    return res.data;
  }
  return Promise.reject(res);
};

const errorInterceptor = (error: AxiosError<ApiError>) => {
  if (error.response) {
    const { status, data } = error.response;

    if (status === 401) {
      localStorage.removeItem('accessToken');
      location.replace('/pre');
    }
    const message = data?.message || '알 수 없는 에러가 발생했습니다.';
    return Promise.reject({ statusCode: status, message, error: data?.error });
  }
  return Promise.reject({ statusCode: 500, message: '서버와의 연결이 끊어졌습니다.' });
};

export const client = createAxiosInstance();
client.interceptors.response.use(responseInterceptor, errorInterceptor);
// 여기서 auth req interceptor 로 customAuthError 발생시키기 -> ErrorBoundary 에서 해결

export type LocationResponse = {
  message: string;
  location: string;
};

export type ApiError = {
  statusCode?: number;
  message: string;
  error?: string;
};

export type ApiResponse = {
  message: string;
};

export const get = <T>(...args: Parameters<typeof client.get>) => {
  return client.get<T, T>(...args);
};

export const post = <T = ApiResponse>(...args: Parameters<typeof client.post>) => {
  return client.post<T, T>(...args);
};

export const patch = <T = ApiResponse>(...args: Parameters<typeof client.patch>) => {
  return client.patch<T, T>(...args);
};

export const put = <T = ApiResponse>(...args: Parameters<typeof client.put>) => {
  return client.put<T, T>(...args);
};

export const del = <T = ApiResponse>(...args: Parameters<typeof client.delete>) => {
  return client.delete<T, T>(...args);
};

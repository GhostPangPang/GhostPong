import { io } from 'socket.io-client';

const createSocketInstance = () => {
  const isDev = import.meta.env.MODE === 'development';
  const token = localStorage.getItem('accessToken');

  if (isDev) {
    return io(import.meta.env.VITE_API_URL, {
      autoConnect: false,
      extraHeaders: { 'x-my-id': '1' },
      withCredentials: true,
    });
  } else {
    return io(import.meta.env.VITE_API_URL, {
      autoConnect: false,
      extraHeaders: { Authorization: `${token ?? ''}` },
      withCredentials: true,
    });
  }
};

export const socket = createSocketInstance();

export const connectSocket = () => {
  return socket.connect();
};

export const onEvent = <T>(event: string, cb: (data: T) => void) => {
  return socket.on(event, cb);
};

export const emitEvent = <T>(event: string, data?: T) => {
  return socket.emit(event, data);
};

export const offEvent = (event: string) => {
  return socket.off(event);
};

export const disconnectSocket = () => {
  return socket.disconnect();
};

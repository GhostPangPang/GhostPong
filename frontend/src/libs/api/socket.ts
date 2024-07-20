import { io } from 'socket.io-client';
import { getAccessToken } from './auth';

const createSocketInstance = () => {
  const token = getAccessToken();

  return io(import.meta.env.VITE_BASE_URL, {
    autoConnect: false,
    auth: { token: `${token ?? ''}` },
    withCredentials: true,
  });
};

export const socket = createSocketInstance();

export const connectSocket = () => {
  return socket.connect();
};

export const onEvent = <T>(event: string, cb: (data: T) => void) => {
  return socket.on(event, cb);
};

export const emitEvent = <T, U>(event: string, data?: T, callback?: (response: U) => void) => {
  if (callback) {
    socket.emit(event, data, callback);
  } else {
    socket.emit(event, data);
  }
};

export const offEvent = (event: string) => {
  return socket.off(event);
};

export const disconnectSocket = () => {
  return socket.disconnect();
};

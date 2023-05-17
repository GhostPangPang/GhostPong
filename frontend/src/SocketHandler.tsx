import { useEffect } from 'react';
import { connectSocket, disconnectSocket } from '@/libs/api';

export const SocketHandler = () => {
  useEffect(() => {
    connectSocket();

    return () => {
      disconnectSocket();
    };
  }, []);

  return <></>;
};

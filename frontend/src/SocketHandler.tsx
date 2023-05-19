import { useEffect } from 'react';
import { connectSocket, disconnectSocket, emitEvent, offEvent, onEvent } from '@/libs/api';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { newMessageIdListState, newMessagesState } from './stores';
import { socketState } from './stores/socketState';
import { Message } from '@/dto/message/socket';

const MessageEvent = {
  LASTVIEW: 'last-message-view',
  MESSAGE: 'message',
};

export const SocketHandler = () => {
  const socket = useRecoilValue(socketState);
  const newMessages = useRecoilValue(newMessagesState);
  const updateMessageEvent = useRecoilCallback(({ snapshot, set }) => (data: Message) => {
    console.log('socket message', data);
    const current = snapshot.getLoadable(newMessagesState).getValue().friend;
    if (!current) return;
    if (current.id === data.id) {
      console.log('current mesage update', data);

      set(newMessagesState, (prev) => ({
        ...prev,
        messages: [...prev.messages, data],
      }));
    } else {
      console.log('change message id list', data.id, 'prevId', current.id, 'newMessages', newMessages);

      set(newMessageIdListState, (prev) => [...prev, data.id]);
    }
  });

  // Init socket
  useEffect(() => {
    connectSocket();

    onEvent('exception', (error) => {
      console.log('WebSocket Error', error);
    });

    return () => {
      disconnectSocket();
    };
  }, []);

  // Turn on message socket event
  useEffect(() => {
    if (!socket.message) return;
    onEvent(MessageEvent.MESSAGE, updateMessageEvent);
    return () => {
      offEvent(MessageEvent.MESSAGE);
    };
  }, [socket]);

  // Turn on game socket event
  useEffect(() => {
    if (!socket.game) return;
    // register game socket on event
  }, [socket]);

  useEffect(() => {
    if (newMessages.friend === null) return;
    console.log('socket message lastView', newMessages);
    emitEvent(MessageEvent.LASTVIEW, { friendId: newMessages.friend.id, lastViewTime: new Date().toISOString() });
  }, [newMessages.friend]);

  return <></>;
};

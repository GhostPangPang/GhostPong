import { useEffect } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { emitEvent, offEvent, onEvent } from '@/libs/api';
import { MessageData, changeMessageIdListState, currentMessageIdState, receivedMessageListState } from '@/stores';

const MessageEvent = {
  JOIN: 'join-friend-room',
  LEAVE: 'leave-friend-room',
  LASTVIEW: 'last-message-view',
  MESSAGE: 'message',
};

export const useMessagesEvent = () => {
  const [currentId, setCurrentId] = useRecoilState(currentMessageIdState);
  const [receivedMessageList, setReceivedMessageList] = useRecoilState(receivedMessageListState);
  const [sendMessageList, setSendMessageList] = useRecoilState(receivedMessageListState);
  const [changeIdList, setChangeIdList] = useRecoilState(changeMessageIdListState);

  const resetCurrentMessage = useResetRecoilState(receivedMessageListState);
  const resetCurrentMessageId = useResetRecoilState(currentMessageIdState);

  useEffect(() => {
    const handleMessages = (data: MessageData) => {
      if (data.id === currentId) {
        setReceivedMessageList((prev) => [...prev, data]);
      } else {
        setChangeIdList((prev) => [...prev, data.id]);
      }
    };
    emitEvent(MessageEvent.JOIN);
    onEvent(MessageEvent.MESSAGE, handleMessages);

    return () => {
      offEvent(MessageEvent.MESSAGE);
      emitEvent(MessageEvent.LEAVE);
    };
  }, []);

  useEffect(() => {
    if (currentId === -1) return;

    emitEvent(MessageEvent.LASTVIEW, { friendId: currentId, lastViewTime: new Date() });

    return () => {
      resetCurrentMessage();
      resetCurrentMessageId();
    };
  }, [currentId]);

  const sendMessage = (content: string) => {
    setSendMessageList((prev) => [...prev, { id: currentId, content }]);
    emitEvent(MessageEvent.MESSAGE, { id: currentId, content });
  };

  return {
    currentId,
    setCurrentId,
    receivedMessageList,
    sendMessageList,
    changeIdList,
    sendMessage,
  };
};

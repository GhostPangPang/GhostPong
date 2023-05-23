import { emitEvent } from '@/libs/api';
import { newMessageIdListState, newMessagesSelector, newMessagesState } from '@/stores';
import { Friend } from '@/types/entity';
import { useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil';
import { MessageEvent } from '@/constants/event';

export const useNewMessages = () => {
  const newMessages = useRecoilValue(newMessagesSelector);
  const [newMessagesInfo, setNewMessagesInfo] = useRecoilState(newMessagesState);
  const [newMessageIdList, setNewMessageIdList] = useRecoilState(newMessageIdListState);

  const changeMessageRoom = useRecoilCallback(({ snapshot, set }) => (friend: Friend) => {
    const current = snapshot.getLoadable(newMessagesState).getValue().friend;

    if (current) emitEvent(MessageEvent.LASTVIEW, { friendId: current.id, lastViewTime: new Date().toISOString() });
    set(newMessagesState, { friend: friend, messages: [] });
  });

  const sendMessage = (content: string) => {
    const { friend } = newMessagesInfo;
    if (!friend) return;

    const data = { id: friend.id, receiverId: friend.user.id, content, createdAt: new Date().toISOString() };

    setNewMessagesInfo((prev) => ({
      ...prev,
      messages: [...prev.messages, data],
    }));
    emitEvent('message', data);
  };

  const viewMessage = (friendId: number) => {
    setNewMessageIdList((prev) => prev.filter((id) => id !== friendId));
  };

  return {
    currentFriend: newMessagesInfo.friend,
    newMessages,
    newMessageIdList,
    changeMessageRoom,
    sendMessage,
    viewMessage,
  };
};

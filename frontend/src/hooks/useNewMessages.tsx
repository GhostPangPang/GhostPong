import { emitEvent } from '@/libs/api';
import { newMessageIdListState, newMessagesState } from '@/stores';
import { Friend } from '@/types/entity';
import { useRecoilCallback, useRecoilState } from 'recoil';
import { MessageEvent } from '@/constants/event';

export const useNewMessages = () => {
  const [newMessages, setNewMessages] = useRecoilState(newMessagesState);
  const [newMessageIdList, setNewMessageIdList] = useRecoilState(newMessageIdListState);

  const changeMessageRoom = useRecoilCallback(({ snapshot, set }) => (friend: Friend) => {
    const current = snapshot.getLoadable(newMessagesState).getValue().friend;

    if (current) emitEvent(MessageEvent.LASTVIEW, { friendId: current.id, lastViewTime: new Date().toISOString() });
    set(newMessagesState, { friend: friend, messages: [] });
  });

  const sendMessage = (content: string) => {
    const { friend } = newMessages;
    if (!friend) return;

    const data = { id: friend.id, receiverId: friend.user.id, content, createdAt: new Date().toISOString() };

    setNewMessages((prev) => ({
      ...prev,
      messages: [...prev.messages, data],
    }));
    emitEvent('message', data);
  };

  const viewMessage = (friendId: number) => {
    setNewMessageIdList((prev) => prev.filter((id) => id !== friendId));
  };

  return { newMessages, newMessageIdList, changeMessageRoom, sendMessage, viewMessage };
};

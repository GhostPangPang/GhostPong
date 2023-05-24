import { emitEvent } from '@/libs/api';
import { useRecoilState } from 'recoil';
import { newChannelDataState } from '@/stores';
import { Chat } from '@/dto/channel/socket';

export const useChat = () => {
  const [newChannelData, setNewChannelData] = useRecoilState(newChannelDataState);

  const sendChat = (content: string) => {
    const { channelId, currentUserId } = newChannelData;

    const data: Chat = {
      channelId,
      senderId: currentUserId,
      createdAt: new Date().toISOString(),
      content,
    };

    setNewChannelData((prev) => ({
      ...prev,
      chats: [...prev.chats, data],
    }));
    emitEvent('chat', data);
  };

  return { sendChat };
};

import { emitEvent } from '@/libs/api';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { channelDataState, channelIdState } from '@/stores';
import { SendChat } from '@/dto/channel/socket';
import { useAuth } from '../auth';

export const useChat = () => {
  const channelId = useRecoilValue(channelIdState);
  const setNewChannelData = useSetRecoilState(channelDataState);
  const { userInfo } = useAuth();

  const sendChat = (content: string) => {
    const data: SendChat = {
      channelId,
      content,
    };

    setNewChannelData((prev) => ({
      ...prev,
      chats: [...prev.chats, { senderId: userInfo.id, senderNickname: '나', content: content }],
    }));
    emitEvent('send-chat', data, (data: { message: string }) => {
      setNewChannelData((prev) => ({
        ...prev,
        chats: [...prev.chats, { senderId: userInfo.id, senderNickname: '관리자', content: data.message }],
      }));
    });
  };

  return { sendChat };
};

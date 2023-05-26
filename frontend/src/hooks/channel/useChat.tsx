import { emitEvent } from '@/libs/api';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { channelDataState, channelIdState } from '@/stores';
import { NewChat as Chat } from '@/dto/channel/socket';
import { useUserInfo } from '../user';

export const useChat = () => {
  const channelId = useRecoilValue(channelIdState);
  const setNewChannelData = useSetRecoilState(channelDataState);
  const { userInfo } = useUserInfo();

  const sendChat = (content: string) => {
    const data: Chat = {
      // channelId,
      senderId: userInfo.id,
      senderNickname: userInfo.nickname,
      // createdAt: new Date().toISOString(),
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

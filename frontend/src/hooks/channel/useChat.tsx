import { emitEvent } from '@/libs/api';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { channelDataState, channelIdState } from '@/stores';
import { SendChat } from '@/dto/channel/socket';
import { useUserInfo } from '../user';

export const useChat = () => {
  const channelId = useRecoilValue(channelIdState);
  const setNewChannelData = useSetRecoilState(channelDataState);
  const { userInfo } = useUserInfo();

  const sendChat = (content: string) => {
    const data: SendChat = {
      channelId,
      content,
    };

    setNewChannelData((prev) => ({
      ...prev,
      chats: [...prev.chats, { senderId: userInfo.id, senderNickname: '나', content: content }],
    }));
    emitEvent('send-chat', data);
  };

  return { sendChat };
};

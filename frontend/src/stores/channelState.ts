import { atom } from 'recoil';
import { Chat, MemberInfo } from '@/dto/channel/socket';

export type ChannelData = {
  name: string;
  leftPlayer: MemberInfo | null;
  rightPlayer: MemberInfo | null;
  observers: MemberInfo[] | [];
  isInGame: boolean;
  currentRole: 'owner' | 'admin' | 'member' | undefined;
  currentUserId: number;
  chats: Chat[];
};

export const newChannelDataState = atom<ChannelData>({
  key: '/channel',
  default: {
    name: '',
    leftPlayer: null,
    rightPlayer: null,
    observers: [],
    isInGame: false,
    currentRole: undefined,
    currentUserId: -1,
    chats: [],
  },
});

import { atom, selector } from 'recoil';
import { Chat, MemberInfo } from '@/dto/channel/socket';

export type ChannelData = {
  name: string;
  channelId: string;
  leftPlayer: MemberInfo | null;
  rightPlayer: MemberInfo | null;
  observers: MemberInfo[] | [];
  isInGame: boolean;
  currentRole: 'owner' | 'admin' | 'member' | undefined;
  currentUserId: number;
  chats: Chat[] | [];
};

export const newChannelDataState = atom<ChannelData>({
  key: '/channel',
  default: {
    name: '',
    channelId: '',
    leftPlayer: null,
    rightPlayer: null,
    observers: [],
    isInGame: false,
    currentRole: undefined,
    currentUserId: -1,
    chats: [],
  },
});

export const newChatSelector = selector<Chat[]>({
  key: '/chat/selector',
  get: ({ get }) => {
    const { chats } = get(newChannelDataState);
    return [...chats].reverse();
  },
});

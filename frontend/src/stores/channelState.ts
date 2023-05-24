import { atom, selector } from 'recoil';
import { Chat, MemberInfo } from '@/dto/channel/socket';

export type ChannelData = {
  name: string;
  leftPlayer: MemberInfo | null;
  rightPlayer: MemberInfo | null;
  observers: MemberInfo[];
  isInGame: boolean;
  currentRole: 'owner' | 'admin' | 'member' | undefined;
  chats: Chat[];
};

export const channelIdState = atom<string>({
  key: '/channel/id',
  default: '',
});

export const channelDataState = atom<ChannelData>({
  key: '/channel',
  default: {
    name: '',
    leftPlayer: null,
    rightPlayer: null,
    observers: [],
    isInGame: false,
    currentRole: undefined,
    chats: [],
  },
});

export const chatSelector = selector<Chat[]>({
  key: '/chat/selector',
  get: ({ get }) => {
    const { chats } = get(channelDataState);
    return [...chats].reverse();
  },
});

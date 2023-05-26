import { atom, selector } from 'recoil';
import { NewChat as Chat, MemberInfo, ChannelRole } from '@/dto/channel/socket';

export type ChannelData = {
  name: string;
  leftPlayer: MemberInfo | null;
  rightPlayer: MemberInfo | null;
  observers: MemberInfo[];
  isInGame: boolean;
  currentRole: ChannelRole | null;
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
    currentRole: 'member',
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

export const currentRoleSelector = selector({
  key: 'currentRoleSelector',
  get: ({ get }) => {
    const channelData = get(channelDataState);
    return channelData.currentRole;
  },
});

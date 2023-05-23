import { atom, selector } from 'recoil';
import { Message } from '@/dto/message/socket';
import { Friend } from '@/types/entity';

export type MessageInfoData = {
  friend: Friend | null;
  messages: Message[];
};

export const newMessagesState = atom<MessageInfoData>({
  key: '/message/current',
  default: {
    friend: null,
    messages: [],
  },
});

export const newMessageIdListState = atom<number[]>({
  key: '/message/changeId',
  default: [],
});

export const newMessagesSelector = selector<Message[]>({
  key: '/message/selector',
  get: ({ get }) => {
    const { messages } = get(newMessagesState);
    return [...messages].reverse();
  },
});

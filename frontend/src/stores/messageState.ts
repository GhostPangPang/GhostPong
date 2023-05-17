import { atom } from 'recoil';

export type MessageData = {
  id: number;
  content: string;
};

export const currentMessageIdState = atom<number>({
  key: '/message/currentId',
  default: -1,
});

export const receivedMessageListState = atom<MessageData[]>({
  key: '/message/received',
  default: [],
});

export const sendMessageListState = atom<MessageData[]>({
  key: '/message/send',
  default: [],
});

export const changeMessageIdListState = atom<number[]>({
  key: '/message/changeId',
  default: [],
});

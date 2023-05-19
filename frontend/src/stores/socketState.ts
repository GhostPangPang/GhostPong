import { atom } from 'recoil';

export const socketState = atom({
  key: '/socket',
  default: {
    global: true,
    message: false,
    game: false,
  },
});

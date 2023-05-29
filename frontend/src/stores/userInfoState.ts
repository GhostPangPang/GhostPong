import { UserInfoResponse } from '@/dto/user/response';
import { atom } from 'recoil';

export const UserInfoState = atom<UserInfoResponse>({
  key: '/userInfo',
  default: {
    id: -1,
    nickname: '',
    image: '',
    exp: 0,
    blockedUsers: [],
  },
});

export const blockedIdList = atom<number[]>({
  key: '/blockedIdList',
  default: [],
});

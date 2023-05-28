import { UserInfoResponse } from '@/dto/user/response';
import { atom, selector, RecoilState } from 'recoil';

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

export const BlockedUsersSelector = selector<Array<number>>({
  key: '/blockedUsersSelector',
  get: ({ get }: { get: (arg: RecoilState<UserInfoResponse>) => UserInfoResponse }) => {
    const userInfo = get(UserInfoState);
    return userInfo.blockedUsers;
  },
});

import { atom, useRecoilState } from 'recoil';

export const STATE = {
  USER_INFO: 'user',
};

export type UserInfo = {
  id: number;
  nickname: string;
  image: string | null;
  exp: number;
  blocked_users: number[];
};

export const UserInfoState = atom<UserInfo>({
  key: STATE.USER_INFO,
  default: {
    id: -1,
    nickname: '',
    image: null,
    exp: 0,
    blocked_users: [],
  },
});

export const useUserInfo = () => {
  const [userInfo, setUserInfo] = useRecoilState(UserInfoState);

  return { userInfo, setUserInfo };
};

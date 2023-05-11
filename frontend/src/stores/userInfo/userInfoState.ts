import { UserInfoResponse } from '@/dto/user/response';
import { atom, useRecoilState } from 'recoil';

export const STATE = {
  USER_INFO: 'user',
};

export const UserInfoState = atom<UserInfoResponse>({
  key: STATE.USER_INFO,
  default: {
    id: -1,
    nickname: '',
    image: '',
    exp: 0,
    blockedUsers: [],
  },
});

export const useUserInfo = () => {
  const [userInfo, setUserInfo] = useRecoilState(UserInfoState);

  return { userInfo, setUserInfo };
};

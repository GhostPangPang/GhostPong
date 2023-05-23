import { UserInfoState } from '@/stores';
import { useRecoilState } from 'recoil';

export const useUserInfo = () => {
  const [userInfo, setUserInfo] = useRecoilState(UserInfoState);

  return { userInfo, setUserInfo };
};

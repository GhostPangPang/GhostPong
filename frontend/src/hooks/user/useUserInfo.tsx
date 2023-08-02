import { UserInfoState } from '@/stores';
import { useRecoilState } from 'recoil';

export const useAuth = () => {
  const [userInfo, setUserInfo] = useRecoilState(UserInfoState);

  return { userInfo, setUserInfo };
};

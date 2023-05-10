import { get } from '@/libs/api';
import { useUserInfo } from '@/stores/userInfo';
import { UserInfoResponse } from '@/dto/user/response';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = '/user';

const getUserInfo = async () => {
  const data = await get<UserInfoResponse>(API.USER.INFO);
};

const initialData: UserInfoResponse = {
  id: -1,
  nickname: '',
  image: '',
  exp: 0,
  blockedUsers: [],
};

export const useAuth = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useUserInfo();
  const {
    data = initialData,
    isLoading,
    refetch,
  } = useQuery<UserInfoResponse>({
    queryKey: [API.USER.INFO],
    queryFn: getUserInfo,
    retryOnMount: true,
    staleTime: Infinity,
    onError: (error) => {
      console.log('useAuth error', error);
    },
  });

  useEffect(() => {
    console.log('useAuth data', data);
    if (data) setUserInfo(data);
    else navigate('/pre');
  }, [data]);

  return { userInfo, isLoading, refetch };
};

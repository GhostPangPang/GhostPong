import { get } from '@/libs/api';
import { useUserInfo } from '@/hooks/useUserInfo';
import { UserInfoResponse } from '@/dto/user/response';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = '/user';

const getUserInfo = async () => {
  return await get<UserInfoResponse>(API);
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
    isFetching,
    refetch,
  } = useQuery<UserInfoResponse>({
    queryKey: [API],
    queryFn: getUserInfo,
    retryOnMount: true,
    staleTime: Infinity,
    onError: (error) => {
      console.log('I can catch now', error);
    },
  });

  useEffect(() => {
    if (!isFetching && data) setUserInfo(data);
    else navigate('/pre');
  }, [data]);

  return { userInfo, isLoading, refetch };
};

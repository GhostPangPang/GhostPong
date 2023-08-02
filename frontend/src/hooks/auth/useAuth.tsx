import { get } from '@/libs/api';
import { UserInfoResponse } from '@/dto/user/response';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = '/user';

const getUserInfo = async () => {
  return await get<UserInfoResponse>(API);
};

const initUserInfo = {
  id: -1,
  nickname: '',
  image: '',
  exp: 0,
  blockedUsers: [],
};

export const useAuth = () => {
  const navigate = useNavigate();
  const {
    data = initUserInfo,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery<UserInfoResponse>({
    queryKey: [API],
    queryFn: getUserInfo,
    staleTime: 1000 * 60 * 60 * 24,
  });

  useEffect(() => {
    if (isError) navigate('/pre');
  }, [data]);

  return { auth: data, userInfo: data, isFetching, isLoading, refetch };
};

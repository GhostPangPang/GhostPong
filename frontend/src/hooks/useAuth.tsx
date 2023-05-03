import { get } from '@/libs/api';
import { UserInfo, useUserInfo } from '@/stores/userInfo';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export const API = {
  USER: {
    INFO: '/user',
  },
};

const getUserInfo = async () => {
  return await get<UserInfo>(API.USER.INFO);
};

export const useAuth = () => {
  const { userInfo, setUserInfo } = useUserInfo();
  const { data, isLoading, refetch } = useQuery<UserInfo>({
    queryKey: [API.USER.INFO],
    queryFn: getUserInfo,
    refetchOnMount: true,
    retryOnMount: true,
    suspense: true,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (data) setUserInfo(data);
  }, [data]);

  return { userInfo, isLoading, refetch };
};

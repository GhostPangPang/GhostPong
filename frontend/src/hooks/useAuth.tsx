import { get } from '@/libs/api';
import { UserInfo, useUserInfo } from '@/stores/userInfo';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

const API = '/user';

const getUserInfo = async () => {
  return await get<UserInfo>(API);
};

export const useAuth = () => {
  const { userInfo, setUserInfo } = useUserInfo();
  const { data, isLoading, refetch } = useQuery<UserInfo>({
    queryKey: [API],
    queryFn: getUserInfo,
    retryOnMount: true,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (data) setUserInfo(data);
  }, [data]);

  return { userInfo, isLoading, refetch };
};

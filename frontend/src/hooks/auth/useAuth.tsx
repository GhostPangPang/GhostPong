import { get } from '@/libs/api';
import { useUserInfo } from '@/hooks/user/useUserInfo';
import { UserInfoResponse } from '@/dto/user/response';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = '/user';

const getUserInfo = async () => {
  return await get<UserInfoResponse>(API);
};

export const useAuth = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useUserInfo();
  const {
    data = null,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery<UserInfoResponse>({
    queryKey: [API],
    queryFn: getUserInfo,
    retryOnMount: true,
    staleTime: Infinity,
    useErrorBoundary: false,
    retry: 0,
  });

  useEffect(() => {
    if (!isFetching && data) setUserInfo(data);
    if (isError) navigate('/pre');
  }, [data]);

  return { auth: data, userInfo, isFetching, isLoading, refetch };
};

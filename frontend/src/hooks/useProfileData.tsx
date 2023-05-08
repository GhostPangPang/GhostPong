import { get } from '@/libs/api';
import { useQuery } from '@tanstack/react-query';
import { UserProfileResponse } from '@/dto/user/response';

const getProfile = async (userId: number) => {
  return await get<UserProfileResponse>(`/user/${userId}/profile`);
};

export const useProfileData = (userId: number) => {
  return useQuery<UserProfileResponse>({
    queryKey: [userId, 'profile'],
    queryFn: () => getProfile(userId),
    refetchOnMount: true,
    retryOnMount: true,
    suspense: true,
    staleTime: Infinity,
  });
};

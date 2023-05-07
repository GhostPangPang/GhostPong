import { get } from '@/libs/api';
import { useQuery } from '@tanstack/react-query';
import { UserProfileResponse } from '@/dtos/user/response/user-profile-response.interface';

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

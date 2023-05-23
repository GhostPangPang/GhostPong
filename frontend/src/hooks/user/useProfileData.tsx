import { get } from '@/libs/api';
import { useQuery } from '@tanstack/react-query';
import { UserProfileResponse } from '@/dto/user/response';

const getProfile = async (userId: number) => {
  return await get<UserProfileResponse>(`/user/${userId}/profile`);
};

const initialData = {
  nickname: '',
  image: '',
  exp: 0,
  winCount: 0,
  loseCount: 0,
  achievements: 0,
};

export const useProfileData = (userId: number) => {
  const { data = initialData } = useQuery<UserProfileResponse>({
    queryKey: [userId, 'profile'],
    queryFn: () => getProfile(userId),
    retryOnMount: true,
    suspense: true,
    staleTime: Infinity,
  });

  return data;
};

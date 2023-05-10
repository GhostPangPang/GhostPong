import { useQuery } from '@tanstack/react-query';
import { get } from '@/libs/api';
import { FriendResponse } from '@/dto/friend/response';

const API = '/friend';

const getFriends = async () => {
  return await get<FriendResponse>(API);
};

const initialData: FriendResponse = {
  friends: [],
};

export const useFriends = () => {
  const {
    data = initialData,
    isLoading,
    isError,
    refetch,
  } = useQuery<FriendResponse>({
    queryKey: [API],
    queryFn: getFriends,
    onError: (error) => {
      throw error;
    },
  });

  return { data, isLoading, isError, refetch };
};

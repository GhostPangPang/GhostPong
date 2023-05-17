import { useQuery } from '@tanstack/react-query';
import { get } from '@/libs/api';
import { FriendResponse } from '@/dto/friend/response';

export const FRIEND = '/friend';

const getFriends = async () => {
  return await get<FriendResponse>(FRIEND);
};

const initialData: FriendResponse = {
  friends: [],
};

export const useFriends = () => {
  const {
    data = initialData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery<FriendResponse>({
    queryKey: [FRIEND],
    queryFn: getFriends,
    onError: (error) => {
      throw error;
    },
  });

  return { data, isLoading, isFetching, isError, refetch };
};

import { useQuery } from '@tanstack/react-query';
import { BlockedUserResponse } from '@/dto/blocked/response';
import { get } from '@/libs/api';

export const BLOCKED = '/blocked';

const getBlockedList = async () => {
  return await get<BlockedUserResponse>(BLOCKED);
};

const initialData: BlockedUserResponse = {
  blocked: [],
};

export const useBlockedList = () => {
  const {
    data = initialData,
    refetch,
    isLoading,
    isError,
    isFetching,
  } = useQuery<BlockedUserResponse>({
    queryKey: [BLOCKED],
    queryFn: getBlockedList,
    cacheTime: 0,
  });

  return { data, refetch, isLoading, isError, isFetching };
};

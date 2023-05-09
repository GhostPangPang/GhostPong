import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import { MessageResponse } from '@/dto/message/response';
import { get } from '@/libs/api';

export type { MessageResponse };

const getMessages = async (friendId: number, offset: number) => {
  return await get<MessageResponse>(`/message/${friendId}?offset=${offset}`);
};

const initialData: InfiniteData<MessageResponse> = {
  pages: [] as MessageResponse[],
  pageParams: [],
};

const MESSAGE_SIZE = 32;

export const useMessages = (friendId: number, offset = 0) => {
  const {
    data = initialData,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ['messages', friendId.toString(), offset.toString()],
    queryFn: ({ pageParam = 0 }) => getMessages(friendId, pageParam),
    enabled: friendId !== -1,
    getNextPageParam: (lastPage) => {
      if (lastPage.messages.length < MESSAGE_SIZE) return undefined;
      return lastPage.messages[lastPage.messages.length - 1].id;
    },
  });

  return { data, isLoading, isError, fetchNextPage, hasNextPage, isFetching };
};

import { get } from '@/libs/api';
import { useInfiniteQuery } from '@tanstack/react-query';
import { UserInfo } from '@/dto/user';
import { UserHistoryResponse } from '@/dto/user/response';

export type { UserInfo, UserHistoryResponse };

let previousTotal = 0;

const getHistory = async (userId: number, cursor: number) => {
  const response = await get<UserHistoryResponse>(`/user/${userId}/history?cursor=${cursor}`);
  const total = response.total || previousTotal;
  previousTotal = total;
  const histories = response.histories || [];
  return { total, histories };
};

const initialData = {
  pages: [{ total: 0, histories: [] }],
};

export const useHistoryData = (userId: number) => {
  const {
    data = initialData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [userId, 'history'],
    queryFn: ({ pageParam = 0 }) => getHistory(userId, pageParam),
    refetchOnMount: true,
    retryOnMount: true,
    suspense: true,
    staleTime: Infinity,
    getNextPageParam: (lastPage, allPages) => {
      console.log(allPages);
      const { total } = lastPage;
      const currentPage = allPages.length;
      const nextPage = currentPage;
      return nextPage < Math.ceil(total / 10) ? nextPage : undefined;
    },
  });
  return { status, data, fetchNextPage, hasNextPage, isFetchingNextPage };
};

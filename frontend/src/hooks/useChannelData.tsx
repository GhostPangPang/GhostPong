import { get, ApiResponse, ApiError } from '@/libs/api';
import { useQuery } from '@tanstack/react-query';
import { ChannelsListResponse } from '@/dto/channel/response';

let previousTotal = 0;

const getChannels = async (cursor: number) => {
  const response = await get<ChannelsListResponse>(`/channel?cursor=${cursor}`);
  const channels = response.channels || [];
  if (response.total) {
    previousTotal = response.total;
  }
  return { total: previousTotal, channels };
};

const initialData: ChannelsListResponse = {
  total: 0,
  channels: [
    {
      id: '-1',
      name: '-1',
      mode: 'public',
      count: -1,
    },
  ],
};

export const useChannelData = (cursor: number) => {
  const { data = initialData, refetch } = useQuery({
    queryKey: ['projects', cursor],
    queryFn: () => getChannels(cursor),
    keepPreviousData: true,
    staleTime: Infinity,
  });

  return { data, refetch };
};

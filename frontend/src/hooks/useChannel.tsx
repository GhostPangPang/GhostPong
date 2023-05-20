import { get, post, ApiResponse, ApiError, LocationResponse } from '@/libs/api';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { ChannelsListResponse } from '@/dto/channel/response';
import { CreateChannelRequest, JoinChannelRequest } from '@/dto/channel/request';
import { useNavigate } from 'react-router-dom';

const CHANNEL = '/channel';

interface useChannelProps {
  cursor?: number;
}

interface postJoinChannelProps extends JoinChannelRequest {
  id: string;
}

let previousTotal = 0;

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

const getChannels = async (cursor: number) => {
  const response = await get<ChannelsListResponse>(CHANNEL + `?cursor=${cursor}`);
  const channels = response.channels || [];
  if (response.total) {
    previousTotal = response.total;
  }
  return { total: previousTotal, channels };
};

const postCreateChannel = async (request: CreateChannelRequest) => {
  return await post<LocationResponse>(CHANNEL, request);
};

const postJoinChannel = async ({ mode, password, id }: postJoinChannelProps) => {
  return await post<ApiResponse>(CHANNEL + `/${id}`, { mode, password });
};

export const useChannel = ({ cursor = 0 }: useChannelProps) => {
  const { data: channels = initialData, refetch: refetchChannel } = useQuery<ChannelsListResponse>({
    queryKey: [CHANNEL, cursor],
    queryFn: () => getChannels(cursor),
    keepPreviousData: true,
    staleTime: Infinity,
    onError: (error) => {
      throw error;
    },
  });

  return { channels, refetchChannel };
};

export const useChannelMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: joinChannel } = useMutation(postJoinChannel, {
    onSuccess: (data: ApiResponse, { id }) => {
      alert(data.message);
      navigate('/channel/' + id);
    },
    onError: (error: ApiError) => {
      alert(error.message);
    },
  });

  const { mutate: createChannel } = useMutation(postCreateChannel, {
    onSuccess: (data: LocationResponse) => {
      queryClient.invalidateQueries([CHANNEL]);
      alert(data.message);
      navigate(data.location);
    },
    onError: (error: ApiError) => {
      alert(error.message);
    },
  });

  return { joinChannel, createChannel };
};

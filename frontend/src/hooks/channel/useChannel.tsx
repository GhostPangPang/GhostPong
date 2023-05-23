import { get, post, ApiResponse, ApiError, LocationResponse } from '@/libs/api';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { ChannelsListResponse, FullChannelInfoResponse } from '@/dto/channel/response';
import { CreateChannelRequest, JoinChannelRequest } from '@/dto/channel/request';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { newChannelDataState } from '@/stores';
import { useUserInfo } from '../user/useUserInfo';

const CHANNEL = '/channel';

interface useChannelProps {
  cursor?: number;
}

interface postJoinChannelProps extends JoinChannelRequest {
  id: string;
}

let previousTotal = 0;

const initialChannelInfoData: FullChannelInfoResponse = {
  players: [],
  observers: [],
  isInGame: false,
  name: '',
};

const initialChannelListData: ChannelsListResponse = {
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

export const getChannelInfo = async (id: string) => {
  return await get<FullChannelInfoResponse>(CHANNEL + `/${id}`);
};

const postCreateChannel = async (request: CreateChannelRequest) => {
  return await post<LocationResponse>(CHANNEL, request);
};

const postJoinChannel = async ({ mode, password, id }: postJoinChannelProps) => {
  return await post<ApiResponse>(CHANNEL + `/${id}`, { mode, password });
};

export const useChannelInfo = (id: string) => {
  const newChannelData = useRecoilValue(newChannelDataState);
  const setNewChannelData = useSetRecoilState(newChannelDataState);
  const navigate = useNavigate();
  const {
    userInfo: { id: currentUserId },
  } = useUserInfo();

  const { data: channelInfo = initialChannelInfoData, isError } = useQuery<FullChannelInfoResponse, ApiError>({
    queryKey: [CHANNEL, id],
    queryFn: () => getChannelInfo(id),
    keepPreviousData: true,
    staleTime: Infinity,
    suspense: true,
    retry: false,
    useErrorBoundary: true,
    onError: (error) => {
      alert(error.message);
    },
  });

  useEffect(() => {
    // 작동 안함
    console.log('isError', isError);
    if (isError) {
      navigate('/channel/list');
    }
  }, [isError]);

  useEffect(() => {
    console.log('chan', channelInfo);
    if (channelInfo) {
      const currentUserRole = channelInfo.players
        .concat(channelInfo.observers)
        .find((user) => user.userId === currentUserId)?.role;
      const leftPlayer = channelInfo.players.find((player) => player.role === 'owner');
      const rightPlayer = channelInfo.players.filter((player) => player.role !== 'owner');

      setNewChannelData({
        ...newChannelData,
        name: channelInfo.name,
        leftPlayer: leftPlayer || null,
        rightPlayer: rightPlayer[0] || null,
        observers: channelInfo.observers,
        currentUserId: currentUserId,
        currentRole: currentUserRole,
        isInGame: channelInfo.isInGame,
      });
    }
  }, [channelInfo]);
  return { channelInfo };
};

export const useChannel = ({ cursor = 0 }: useChannelProps) => {
  const { data: channels = initialChannelListData, refetch: refetchChannel } = useQuery<ChannelsListResponse>({
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

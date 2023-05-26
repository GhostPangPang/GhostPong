import { get, post, patch, ApiResponse, ApiError, LocationResponse } from '@/libs/api';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { ChannelsListResponse, FullChannelInfoResponse, CreateChannelRequest, JoinChannelRequest } from '@/dto/channel';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { UserInfoState, channelDataState } from '@/stores';

const CHANNEL = '/channel';

interface useChannelProps {
  cursor?: number;
}

interface postJoinChannelProps extends JoinChannelRequest {
  id: string;
}

interface patchBeAdminProps {
  // dto가 없네?
  channelId: string;
  userId: number;
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

const patchBePlayer = async (id: string) => {
  return await patch<ApiResponse>(CHANNEL + `/${id}/player`);
};

const patchBeAdmin = async ({ channelId, userId }: patchBeAdminProps) => {
  return await patch<ApiResponse>(CHANNEL + `/${channelId}/admin`, { userId });
};

const patchBeOwner = async (id: string) => {
  return await patch<ApiResponse>(CHANNEL + `/${id}/owner`);
};

export const useChannel = (id: string) => {
  const navigate = useNavigate();
  const [channelData, setChannelData] = useRecoilState(channelDataState);

  const { id: currentUserId } = useRecoilValue(UserInfoState);
  const resetChannelData = useResetRecoilState(channelDataState);

  const {
    data: channel = initialChannelInfoData,
    refetch: refetchChannel,
    isFetching,
    isError,
  } = useQuery<FullChannelInfoResponse, ApiError>({
    queryKey: [CHANNEL, id],
    queryFn: () => getChannelInfo(id),
    keepPreviousData: false,
    staleTime: 0,
    suspense: true,
    enabled: !!id,
    retry: false,
    refetchOnWindowFocus: false,
    useErrorBoundary: true,
    onError: (error) => {
      alert(error.message);
    },
  });

  useEffect(() => {
    if (!isFetching && isError) {
      navigate('/channel/list');
    }
  }, [isError]);

  useEffect(() => {
    if (channel) {
      const currentUserRole = channel.players
        .concat(channel.observers)
        .find((user) => user.userId === currentUserId)?.role;
      const leftPlayer = channel.players.find((player) => player.role === 'owner');
      const rightPlayer = channel.players.filter((player) => player.role !== 'owner');

      setChannelData({
        ...channelData,
        name: channel.name,
        leftPlayer: leftPlayer || null,
        rightPlayer: rightPlayer[0] || null,
        observers: channel.observers,
        currentRole: currentUserRole,
        isInGame: channel.isInGame,
      });
    }
    return () => {
      resetChannelData();
    };
  }, [channel]);

  return { channel, refetchChannel };
};

export const useChannelList = ({ cursor = 0 }: useChannelProps) => {
  const queryClient = useQueryClient();

  const { data: channels = initialChannelListData, refetch: refetchChannel } = useQuery<ChannelsListResponse>({
    queryKey: [CHANNEL, cursor],
    queryFn: () => getChannels(cursor),
    keepPreviousData: true,
    staleTime: 0,
    refetchOnWindowFocus: false,
    onError: (error) => {
      throw error;
    },
  });

  queryClient.invalidateQueries([CHANNEL, cursor]);
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

  const { mutate: becomePlayer } = useMutation(patchBePlayer, {
    onSuccess: (data: ApiResponse, id: string) => {
      queryClient.invalidateQueries([CHANNEL, id]);
      alert(data.message);
    },
    onError: (error: ApiError) => {
      alert(error.message);
    },
  });

  const { mutate: becomeAdmin } = useMutation(patchBeAdmin, {
    onSuccess: (data: ApiResponse, { channelId: id }) => {
      queryClient.invalidateQueries([CHANNEL, id]);
      alert(data.message);
    },
    onError: (error: ApiError) => {
      alert(error.message);
    },
  });

  const { mutate: becomeOwner } = useMutation(patchBeOwner, {
    onSuccess: (data: ApiResponse, id: string) => {
      queryClient.invalidateQueries([CHANNEL, id]);
      alert(data.message);
    },
    onError: (error: ApiError) => {
      alert(error.message);
    },
  });

  return { joinChannel, createChannel, becomePlayer, becomeAdmin, becomeOwner };
};

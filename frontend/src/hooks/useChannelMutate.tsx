import { useMutation } from '@tanstack/react-query';
import { post, ApiError, LocationResponse, ApiResponse } from '@/libs/api';
import { CreateChannelRequest, JoinChannelRequest } from '@/dto/channel/request';
import { useNavigate } from 'react-router-dom';

const API = '/channel';

interface postJoinChannelRequest extends JoinChannelRequest {
  id: string;
}

const postChannel = async (request: CreateChannelRequest) => {
  return await post<LocationResponse>(API, request);
};

const postJoinChannel = async ({ mode, password, id }: postJoinChannelRequest) => {
  return await post<ApiResponse>(API + `/${id}`, { mode, password });
};

export const useJoinChannelMutation = ({ mode, password, id }: postJoinChannelRequest) => {
  const navigate = useNavigate();

  if (mode !== 'protected') password = undefined;

  const mutation = useMutation(
    () => {
      return postJoinChannel({ mode, password, id });
    },
    {
      onSuccess: (data: ApiResponse) => {
        alert(data.message);
        navigate('/channel/' + id);
        console.log(data);
      },
      onError: (error: ApiError) => {
        alert(error.message);
        throw new Error(error.message);
      },
    },
  );

  const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    mutation.mutate();
  };

  return { handleSubmit };
};

export const useChannelMutation = (channel: CreateChannelRequest) => {
  const navigate = useNavigate();

  const mutation = useMutation(
    () => {
      return postChannel(channel);
    },
    {
      onSuccess: (data: LocationResponse) => {
        alert(data.message);
        navigate(`${data.location}`);
        console.log(`${data.location}`);
      },
      onError: (error: ApiError) => {
        alert(error.message);
        throw new Error(error.message);
      },
    },
  );

  const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    mutation.mutate();
  };

  return { handleSubmit };
};

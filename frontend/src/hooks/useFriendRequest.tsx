import { useQuery } from '@tanstack/react-query';
import { RequestedFriendsResponse } from '@/dto/friend/response';
import { get } from '@/libs/api';

export const FRIEND_REQUEST = '/friend/request';

const getFriendRequest = async () => {
  return await get<RequestedFriendsResponse>(FRIEND_REQUEST);
};

const initialData: RequestedFriendsResponse = {
  requests: [],
};

export const useFriendRequest = () => {
  const { data = initialData } = useQuery<RequestedFriendsResponse>({
    queryKey: [FRIEND_REQUEST],
    queryFn: () => getFriendRequest(),
  });

  return { data };
};

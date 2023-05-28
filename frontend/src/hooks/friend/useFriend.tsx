import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get, post, del, ApiResponse, ApiError } from '@/libs/api';
import { FriendResponse as FriendDto, RequestedFriendsResponse as RequestFriendDto } from '@/dto/friend/response';
import { QueryProps } from '@/types/query';

type FriendResponse = FriendDto['friends'];
type RequestFriendResponse = RequestFriendDto['requests'];

export const FRIEND = '/friend';
export const FRIEND_REQUEST = '/friend/request';

const getFriends = async () => {
  return (await get<FriendDto>(FRIEND)).friends;
};

const getFriendRequest = async () => {
  return (await get<RequestFriendDto>(FRIEND_REQUEST)).requests;
};

const postFriendAccept = async (friendId: number) => {
  return await post(`/friend/accept/${friendId}`);
};

const postFriendReject = async (friendId: number) => {
  return await post(`/friend/reject/${friendId}`);
};

const postFriendRequest = async (info: number | string) => {
  if (typeof info === 'string') {
    return await post(`/friend?nickname=${info}`);
  }
  return await post(`/friend/${info}`);
};

const delFriend = async (friendId: number) => {
  return await del(`/friend/${friendId}`);
};

/**
 * useFriend
 * @returns friends, refetchFriends
 */
export const useFriend = () => {
  /**
   * Get friends
   */
  const { data: friends = [], refetch: refetchFriends } = useQuery<FriendResponse>({
    queryKey: [FRIEND],
    queryFn: getFriends,
    onError: (error) => {
      throw error;
    },
  });

  return {
    friends,
    refetchFriends,
  };
};

/**
 * useFriendRequest
 * @returns friendRequests, refetchFriendRequests
 */
export const useFriendRequest = ({ enabled = true }: QueryProps = {}) => {
  /**
   * Get friend requests
   */
  const { data: friendRequests = [], refetch: refetchFriendRequests } = useQuery<RequestFriendResponse>({
    queryKey: [FRIEND_REQUEST],
    queryFn: getFriendRequest,
    enabled: enabled,
    onError: (error) => {
      throw error;
    },
  });

  return {
    friendRequests,
    refetchFriendRequests,
  };
};

/**
 * useFriendMutation
 * @returns requestFriend, deleteFriend, acceptFriendRequest, rejectFriendRequest
 */
export const useFriendMutation = () => {
  const queryClient = useQueryClient();
  /**
   * Update friend requests
   */
  const { mutate: requestFriend } = useMutation(postFriendRequest, {
    onSuccess: (data: ApiResponse) => {
      alert(data.message);
    },
    onError: (error: ApiError) => {
      alert(error.message);
    },
  });

  /**
   * Delete friend
   */
  const { mutate: deleteFriend } = useMutation(delFriend, {
    onMutate: async (friendId) => {
      await queryClient.cancelQueries([FRIEND]);

      const previousFriends = queryClient.getQueryData<FriendResponse>([FRIEND]);

      const updatedFriends = previousFriends?.filter((user) => user.id !== friendId);

      queryClient.setQueryData<FriendResponse>([FRIEND], updatedFriends);

      return { previousFriends };
    },
    onError: (error: ApiError, friendId, context) => {
      console.log('deleteFriend error');
      queryClient.setQueryData<FriendResponse>([FRIEND], context?.previousFriends);

      alert(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries([FRIEND]);
    },
  });

  /**
   * Accept friend request
   */
  const { mutate: acceptFriendRequest } = useMutation(postFriendAccept, {
    onMutate: async (friendId) => {
      await queryClient.cancelQueries([FRIEND_REQUEST]);

      const previousRequests = queryClient.getQueryData<RequestFriendResponse>([FRIEND_REQUEST]);

      const updatedRequests = previousRequests?.filter((user) => user.id !== friendId);

      queryClient.setQueryData<RequestFriendResponse>([FRIEND_REQUEST], updatedRequests);

      return { previousRequests };
    },
    onError: (error: ApiError, friendId, context) => {
      console.log('acceptFriendRequest error');
      queryClient.setQueryData<RequestFriendResponse>([FRIEND_REQUEST], context?.previousRequests);

      alert(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries([FRIEND]);
    },
  });

  /**
   * Reject friend request
   */
  const { mutate: rejectFriendRequest } = useMutation(postFriendReject, {
    onMutate: async (friendId) => {
      await queryClient.cancelQueries([FRIEND_REQUEST]);

      const previousRequests = queryClient.getQueryData<RequestFriendResponse>([FRIEND_REQUEST]);

      const updatedRequests = previousRequests?.filter((user) => user.id !== friendId);

      queryClient.setQueryData<RequestFriendResponse>([FRIEND_REQUEST], updatedRequests);

      return { previousRequests };
    },
    onError: (error: ApiError, friendId, context) => {
      console.log('rejectFriendRequest error');
      queryClient.setQueryData<RequestFriendResponse>([FRIEND_REQUEST], context?.previousRequests);

      alert(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries([FRIEND_REQUEST]);
    },
  });

  return {
    requestFriend,
    deleteFriend,
    acceptFriendRequest,
    rejectFriendRequest,
  };
};

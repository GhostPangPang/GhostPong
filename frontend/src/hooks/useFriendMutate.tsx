import { post, del } from '@/libs/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FRIEND } from './useFriends';
import { FRIEND_REQUEST } from './useFriendRequest';

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

export const useFriendMutate = () => {
  const queryClient = useQueryClient();

  const requestMutation = useMutation(postFriendRequest);
  const acceptMutation = useMutation((friendId: number) => postFriendAccept(friendId), {
    onSuccess: () => {
      queryClient.invalidateQueries([FRIEND]);
      queryClient.invalidateQueries([FRIEND_REQUEST]);
    },
  });
  const rejectMutation = useMutation((friendId: number) => postFriendReject(friendId), {
    onSuccess: () => {
      queryClient.invalidateQueries([FRIEND_REQUEST]);
    },
  });
  const deleteMutation = useMutation((friendId: number) => delFriend(friendId), {
    onSuccess: () => {
      return queryClient.invalidateQueries([FRIEND]);
    },
  });

  return { requestMutation, acceptMutation, rejectMutation, deleteMutation };
};

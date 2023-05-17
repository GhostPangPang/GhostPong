import { post, del } from '@/libs/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BLOCKED } from './useBlockedList';

const postBlocked = async (info: number | string) => {
  if (typeof info === 'string') {
    return await post(`/blocked?nickname=${info}`);
  }
  return await post(`/blocked/${info}`);
};

const deleteBlocked = async (userId: number) => {
  return await del(`/blocked/${userId}`);
};

export const useBlockedMutate = () => {
  const queryClient = useQueryClient();
  const blockedMutation = useMutation(postBlocked, {
    onSuccess: async () => {
      queryClient.invalidateQueries([BLOCKED]);
    },
  });
  const unblockedMutation = useMutation(deleteBlocked);

  return { blockedMutation, unblockedMutation };
};

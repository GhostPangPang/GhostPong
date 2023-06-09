import { get, post, del, ApiError } from '@/libs/api';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { BlockedUserResponse } from '@/dto/blocked/response';
import { FRIEND } from '../friend/useFriend';
import { QueryProps } from '@/types/query';
import { useSetRecoilState } from 'recoil';
import { blockedIdList } from '@/stores';
import { useEffect } from 'react';

type BlockedResponse = BlockedUserResponse['blocked'];

const BLOCKED = '/blocked';

const getBlockedList = async () => {
  return (await get<BlockedUserResponse>(BLOCKED)).blocked;
};

const postBlocked = async (info: number | string) => {
  if (typeof info === 'string') {
    const nickname = info;
    return await post(`/blocked?nickname=${nickname}`);
  }
  const userId = info;
  return await post(`/blocked/${userId}`);
};

const delBlocked = async (userId: number) => {
  return await del(`/blocked/${userId}`);
};

export const useBlocked = ({ enabled = true }: QueryProps = {}) => {
  const setBlockedIdList = useSetRecoilState(blockedIdList);
  const {
    data = [],
    isFetching,
    refetch: refetchBlocked,
  } = useQuery<BlockedResponse>({
    queryKey: [BLOCKED],
    queryFn: getBlockedList,
    enabled: enabled,
    staleTime: 0,
  });

  useEffect(() => {
    if (!isFetching && data) {
      const blockedIdList = data.map((user) => user.id);
      setBlockedIdList(blockedIdList);
    }
  }, [data]);

  const blocked = data.sort((a, b) => {
    return a.nickname.localeCompare(b.nickname);
  });
  return { blocked, refetchBlocked };
};

export const useBlockedMutation = () => {
  const queryClient = useQueryClient();

  const { mutate: updateBlocked } = useMutation(postBlocked, {
    onSuccess: async (data, info) => {
      if (typeof info === 'string') {
        const nickname = info;
        queryClient.setQueryData<BlockedResponse>([BLOCKED], (old) => {
          let result: BlockedResponse = [];
          if (old) result = [...old, { id: 0, nickname: nickname, exp: 0 }];
          return result;
        });
      }
      queryClient.invalidateQueries([FRIEND]);
      queryClient.invalidateQueries([BLOCKED]);
    },
    onError: (error: ApiError) => {
      alert(error.message);
    },
  });

  const { mutate: deleteBlocked } = useMutation(delBlocked, {
    onMutate: async (userId) => {
      await queryClient.cancelQueries([BLOCKED]);

      const previousBlocked = queryClient.getQueryData<BlockedResponse>([BLOCKED]);

      const updatedBlocked = previousBlocked?.filter((user) => user.id !== userId);

      queryClient.setQueryData<BlockedResponse>([BLOCKED], updatedBlocked);
      return { previousBlocked };
    },
    onError: (error, info, context) => {
      console.log('blocked error');
      queryClient.setQueryData<BlockedResponse>([BLOCKED], context?.previousBlocked);

      if (error instanceof Error) alert(error.message);
      else console.log(error);
    },
    onSettled: async () => {
      console.log('blocked settled');
      queryClient.invalidateQueries([BLOCKED]);
    },
  });

  return {
    updateBlocked,
    deleteBlocked,
  };
};

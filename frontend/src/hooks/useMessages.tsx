import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import { get } from '@/libs/api';
import { useRecoilValue } from 'recoil';
import { MessageResponse as MessageDto } from '@/dto/message/response';
import { newMessagesState } from '@/stores';

const MESSAGE = '/message';

type MessageResponse = MessageDto['messages'];

const getMessages = async (friendId: number, offset: number) => {
  return (await get<MessageDto>(`/message/${friendId}?offset=${offset}`)).messages;
};

const initialData: InfiniteData<MessageResponse> = {
  pages: [],
  pageParams: [],
};

const MESSAGE_SIZE = 32;

export const useMessages = () => {
  const newMessages = useRecoilValue(newMessagesState);

  const {
    data: messages = initialData,
    fetchNextPage: fetchNextMessages,
    hasNextPage: hasMoreMessages,
    isFetching,
  } = useInfiniteQuery<MessageResponse>({
    queryKey: [MESSAGE, newMessages.friend?.id],
    queryFn: ({ pageParam = 0 }) => getMessages(newMessages.friend!.id, pageParam),
    enabled: !!newMessages.friend?.id,
    getNextPageParam: (lastPage) => {
      if (lastPage.length < MESSAGE_SIZE) return undefined;
      return lastPage[lastPage.length - 1].id;
    },
  });

  return {
    messages,
    fetchNextMessages,
    hasMoreMessages,
    isFetching,
  };
};

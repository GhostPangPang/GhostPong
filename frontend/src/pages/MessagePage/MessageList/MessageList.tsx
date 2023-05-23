import { Grid, Box } from '@/common';
import { MessageListItem } from './MessageListItem';
import { useFriend } from '@/hooks';
import { Suspense, useEffect, useState } from 'react';
import { useNewMessages } from '@/hooks/useNewMessages';
import { offEvent, onEvent } from '@/libs/api';
import { GLOBALEVENT } from '@/constants';

type UserStatusData = {
  id: number;
  status: 'online' | 'offline' | 'game';
};

export const MessageList = () => {
  const { friends } = useFriend();
  const { changeMessageRoom } = useNewMessages();
  const [messageList, setMessageList] = useState(friends);

  // 리팩토링해야함
  useEffect(() => {
    if (friends.length) {
      changeMessageRoom(friends[0]);
    }
    onEvent(GLOBALEVENT.USER_STATUS, (data: UserStatusData) => {
      setMessageList((prev) =>
        prev.map((message) => (message.user.id === data.id ? { ...message, status: data.status } : message)),
      );
    });

    return () => {
      offEvent(GLOBALEVENT.USER_STATUS);
    };
  }, []);

  useEffect(() => {
    setMessageList(friends);
  }, [friends]);

  return (
    <Box height="100%" flexGrow={1} overflowY="auto">
      <Suspense fallback={<div>MessageList</div>}>
        <Grid as="ul" container="flex" direction="column" size={{ height: '100%', overflowY: 'auto' }}>
          {messageList.map((friend) => (
            <MessageListItem key={friend.id} friend={friend} />
          ))}
        </Grid>
      </Suspense>
    </Box>
  );
};

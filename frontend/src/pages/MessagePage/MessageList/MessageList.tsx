import { Grid, Box } from '@/common';
import { MessageListItem } from './MessageListItem';
import { Suspense, useEffect, useState } from 'react';
import { useFriend } from '@/hooks/friend';
import { offEvent, onEvent } from '@/libs/api';
import { GLOBALEVENT } from '@/constants';

type UserStatusData = {
  id: number;
  status: 'online' | 'offline' | 'game';
};

export const MessageList = () => {
  const { friends } = useFriend();
  const [messageList, setMessageList] = useState(friends);

  useEffect(() => {
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

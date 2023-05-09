import { Grid } from '@/layout/Grid';
import { MessageList } from './MessageList';
import { Message } from './Message';
import { useFriends } from '@/hooks/useFriends';
import { Suspense, useState } from 'react';

export const MessagePage = () => {
  const [selectedFriendId, setSelectedFriendId] = useState(-1);
  const {
    data: { friends },
  } = useFriends();

  console.log('selected', selectedFriendId);
  return (
    <Grid
      container="flex"
      justifyContent="center"
      alignContent="center"
      alignSelf="center"
      gap={1}
      size={{ height: '100%', maxWidth: '120rem', minHeight: '0' }}
    >
      <Grid xs={1}>
        <MessageList selected={selectedFriendId} setSelected={setSelectedFriendId} friends={friends} />
      </Grid>
      <Grid container="flex" direction="column" xs={2}>
        <Suspense fallback={<div>loading...</div>}>
          <Message friendId={selectedFriendId} />
        </Suspense>
      </Grid>
    </Grid>
  );
};

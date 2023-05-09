import { Grid } from '@/layout/Grid';
import { MessageList } from './MessageList';
import { Message } from './Message';
import { useFriends } from '@/hooks/useFriends';
import { Suspense, useState } from 'react';
import { useMessages } from '@/hooks/useMessages';
import { useIntersect } from '@/hooks/useIntersect';

export const MessagePage = () => {
  const [selectedFriendId, setSelectedFriendId] = useState(-1);
  const {
    data: { friends },
  } = useFriends();
  const {
    data: { pages },
    hasNextPage,
    isFetching,
    fetchNextPage,
  } = useMessages(selectedFriendId);
  const messageRef = useIntersect(
    async (entry, observer) => {
      observer.unobserve(entry.target);
      if (hasNextPage && !isFetching) {
        fetchNextPage();
      }
    },
    { rootMargin: '0px 0px 100px 0px' },
  );

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
          <Message ref={messageRef} messages={pages} />
        </Suspense>
      </Grid>
    </Grid>
  );
};

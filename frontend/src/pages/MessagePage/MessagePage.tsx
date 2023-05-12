import { Grid } from '@/common/Grid';
import { MessageList } from './MessageList';
import { Message } from './Message';
import { useFriends } from '@/hooks/useFriends';
import { Suspense, useState } from 'react';
import { GameButton } from '@/common/Button/GameButton';

export const MessagePage = () => {
  const [selectedFriendId, setSelectedFriendId] = useState(-1);
  const {
    data: { friends },
  } = useFriends();

  return (
    <Grid
      container="grid"
      rows={2}
      columns={2}
      rowsSize={[1, 12]}
      columnsSize={[1, 2]}
      rowGap={0.25}
      columnGap={1}
      size={{ height: '100%', maxWidth: '120rem' }}
    >
      <Grid container="flex" justifyContent="end" gridRow="1" gridColumn="2" gap={1}>
        <GameButton size="sm">친구관리</GameButton>
        <GameButton size="sm">차단관리</GameButton>
      </Grid>
      <Grid gridRow="2/3" gridColumn="1/2" size={{ overflowY: 'auto' }}>
        <MessageList selected={selectedFriendId} setSelected={setSelectedFriendId} friends={friends} />
      </Grid>
      <Grid gridRow="2/3" gridColumn="2/3" container="flex" direction="column" size={{ overflowY: 'auto' }}>
        <Suspense fallback={<div>loading...</div>}>
          <Message friendId={selectedFriendId} />
        </Suspense>
      </Grid>
    </Grid>
  );
};

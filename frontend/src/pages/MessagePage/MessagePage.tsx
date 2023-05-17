import { Grid } from '@/common/Grid';
import { MessageList } from './MessageList';
import { Message } from './Message';
import { useFriends } from '@/hooks/useFriends';
import { Suspense, useEffect, useState } from 'react';
import { GameButton } from '@/common/Button/GameButton';
import { useMessagesEvent } from '@/hooks/useMessagesEvent';
import { FriendsModal } from './FriendsModal';
import { BlockModal } from './BlockModal/BlockModal';

export const MessagePage = () => {
  const [friendIsOpen, setFriendIsOpen] = useState(false);
  const [blockIsOpen, setBlockIsOpen] = useState(false);
  const { currentId, setCurrentId } = useMessagesEvent();
  const {
    data: { friends },
  } = useFriends();

  useEffect(() => {
    if (friends && currentId == -1) setCurrentId(friends[0].id);
  }, [friends]);

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
        <GameButton size="sm" onClick={() => setFriendIsOpen(true)}>
          친구관리
        </GameButton>
        <GameButton size="sm" onClick={() => setBlockIsOpen(true)}>
          차단관리
        </GameButton>
      </Grid>
      <Grid gridRow="2/3" gridColumn="1/2" size={{ overflowY: 'auto' }}>
        <MessageList friends={friends} />
      </Grid>
      <Grid gridRow="2/3" gridColumn="2/3" container="flex" direction="column" size={{ overflowY: 'auto' }}>
        <Suspense fallback={<div>loading...</div>}>
          <Message />
        </Suspense>
      </Grid>
      <FriendsModal isOpen={friendIsOpen} onClose={() => setFriendIsOpen(false)} />
      <BlockModal isOpen={blockIsOpen} onClose={() => setBlockIsOpen(false)} />
    </Grid>
  );
};

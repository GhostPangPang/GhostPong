import { Grid, GameButton } from '@/common';
import { MessageList } from './MessageList';
import { Message } from './Message';
import { Suspense, useEffect, useState } from 'react';
import { FriendsModal } from './FriendsModal';
import { BlockModal } from './BlockModal/BlockModal';
import { useSetRecoilState } from 'recoil';
import { socketState } from '@/stores';

export const MessagePage = () => {
  const setSocket = useSetRecoilState(socketState);
  const [friendIsOpen, setFriendIsOpen] = useState(false);
  const [blockIsOpen, setBlockIsOpen] = useState(false);

  useEffect(() => {
    console.log('what the');
    setSocket((prev) => ({ ...prev, message: true })); // 이것도 리팩토링 고민해보기

    return () => setSocket((prev) => ({ ...prev, message: false }));
  }, []);

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
        <MessageList />
      </Grid>
      <Grid gridRow="2/3" gridColumn="2/3" container="flex" direction="column" size={{ overflowY: 'auto' }}>
        <Suspense fallback={<div>Message</div>}>
          <Message />
        </Suspense>
      </Grid>
      <FriendsModal isOpen={friendIsOpen} onClose={() => setFriendIsOpen(false)} />
      <BlockModal isOpen={blockIsOpen} onClose={() => setBlockIsOpen(false)} />
    </Grid>
  );
};

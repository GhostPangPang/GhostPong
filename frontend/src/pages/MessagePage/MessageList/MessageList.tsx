import { Grid } from '@/layout/Grid';
import { Box } from '@/common/Box';
import { FriendResponse } from '@/dto/friend/response';
import { MessageListItem, MessageListItemProps } from './MessageListItem';

interface MessageListProps {
  friends: FriendResponse['friends'];
  selected: number | null;
  setSelected: MessageListItemProps['setSelected'];
}

export const MessageList = ({ friends, selected, setSelected }: MessageListProps) => {
  return (
    <Box height="100%" flexGrow={1} overflowY="auto">
      <Grid as="ul" container="flex" direction="column" size={{ height: '100%', overflowY: 'auto' }}>
        {friends.map((item) => (
          <MessageListItem
            id={item.id}
            key={item.id}
            isDark={item.id == selected}
            setSelected={setSelected}
            status={item.status}
            lastMessageTime={item.lastMessageTime?.toString() ?? null}
            image={item.user.image}
            nickname={item.user.nickname}
          />
        ))}
      </Grid>
    </Box>
  );
};

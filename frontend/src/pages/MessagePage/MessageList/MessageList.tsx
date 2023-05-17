import { Grid } from '@/common/Grid';
import { Box } from '@/common/Box';
import { FriendResponse } from '@/dto/friend/response';
import { MessageListItem } from './MessageListItem';
import { useMessagesEvent } from '@/hooks/useMessagesEvent';

interface MessageListProps {
  friends: FriendResponse['friends'];
}

export const MessageList = ({ friends }: MessageListProps) => {
  const { currentId, setCurrentId, changeIdList } = useMessagesEvent();

  return (
    <Box height="100%" flexGrow={1} overflowY="auto">
      <Grid as="ul" container="flex" direction="column" size={{ height: '100%', overflowY: 'auto' }}>
        {friends.map((item) => (
          <MessageListItem
            key={item.id}
            isDark={item.id == currentId}
            isNewMessage={changeIdList.includes(item.id)}
            setSelected={() => setCurrentId(item.id)}
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

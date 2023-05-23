import { Grid, Text, Avatar, Dropbox, IconButton } from '@/common';
import { darken } from 'polished';
import styled from 'styled-components';
import newSvg from '@/svgs/circle-sm.svg';
import { ReactComponent as More } from '@/svgs/more.svg';
import { formatRelativeDate } from '@/libs/utils';
import { Friend } from '@/types/entity';
import theme from '@/assets/styles/theme';
import { useNewMessages } from '@/hooks/useNewMessages';

export interface MessageListItemProps {
  friend: Friend;
}

const compareDate = (date1: string | Date, date2: string | Date) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.getTime() - d2.getTime();
};

export const MessageListItem = ({ friend }: MessageListItemProps) => {
  const { currentFriend, changeMessageRoom, newMessageIdList, viewMessage } = useNewMessages();

  const items = [
    { label: '친구추가', onClick: () => console.log('친구추가') },
    { label: '차단', onClick: () => console.log('차단') },
    { label: '프로필', onClick: () => console.log('프로필') },
  ];

  const handleClick = () => {
    changeMessageRoom(friend);
    viewMessage(friend.id);
  };

  return (
    <StyledMessageItemWrapper
      onClick={handleClick}
      style={{ backgroundColor: currentFriend?.id === friend.id ? theme.color.surfaceDark : '' }}
    >
      <Grid container="flex" alignItems="center">
        <Grid container="flex" direction="column" alignItems="center" size={{ width: '3rem' }}>
          {(friend.lastMessageTime &&
            friend.lastViewTime &&
            compareDate(friend.lastMessageTime, friend.lastViewTime) > 0) ||
            (newMessageIdList.includes(friend.id) && <img src={newSvg} alt="new" />)}
        </Grid>
        <Grid container="flex" alignItems="center" gap={1}>
          <Avatar size="md" src={friend.user.image} />
          <Grid container="flex" direction="column" gap={0.5}>
            <Text size="xs" weight="light" color="gray100">
              {friend.user.nickname}
            </Text>
            <Text
              size="xxs"
              weight="light"
              color={friend.status === 'online' ? 'online' : friend.status === 'game' ? 'primary' : 'gray150'}
            >
              {friend.status ?? 'offline'}
            </Text>
          </Grid>
        </Grid>
      </Grid>
      <Grid container="flex" justifyContent="end" alignItems="center" gap={1.5}>
        <Text size="xxs" weight="light" color="gray100">
          {formatRelativeDate(friend.lastMessageTime)}
        </Text>
        <Dropbox items={items} placement="bottomright">
          <IconButton>
            <More />
          </IconButton>
        </Dropbox>
      </Grid>
    </StyledMessageItemWrapper>
  );
};

const StyledMessageItemWrapper = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 1.5rem 0;

  &:hover {
    cursor: pointer;
    background-color: ${(props) => darken(0.5, props.theme.color.surface)};
  }
`;

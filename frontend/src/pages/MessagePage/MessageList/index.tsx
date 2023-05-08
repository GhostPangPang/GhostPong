import { Grid } from '@/layout/Grid';
import { darken } from 'polished';
import styled from 'styled-components';
import newSvg from '@/svgs/circle-sm.svg';
import { ReactComponent as More } from '@/svgs/more.svg';
import { Box } from '@/common/Box';
import { Text } from '@/common/Text';
import { Avatar } from '@/common/Avatar';
import { formatRelativeDate } from '@/libs/utils';
import { FriendResponse } from '@/dto/friend/response';

interface MessageListItemProps {
  image: string;
  nickname: string;
  lastMessageTime: string | null;
  isDark: boolean;
}

const StyledMessageItemWrapper = styled.li<{ isDark?: MessageListItemProps['isDark'] }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 1.5rem 0;

  ${(props) => props.isDark && `background-color: ${props.theme.color.surfaceDark};`}

  &:hover {
    cursor: pointer;
    background-color: ${(props) => darken(0.5, props.theme.color.surface)};
  }
`;

const MessageListItem = ({ image, nickname, lastMessageTime, isDark }: MessageListItemProps) => {
  return (
    <StyledMessageItemWrapper isDark={isDark}>
      <Grid container="flex" alignItems="center">
        <Grid container="flex" direction="column" alignItems="center" size={{ width: '3rem' }}>
          <img src={newSvg} alt="new" />
        </Grid>
        <Grid container="flex" alignItems="center" gap={1}>
          <Avatar size="md" src={image} />
          <Grid container="flex" direction="column" gap={0.5}>
            <Text size="xs" weight="light" color="gray100">
              {nickname}
            </Text>
            <Text size="xxs" weight="light" color="gray100">
              Online
            </Text>
          </Grid>
        </Grid>
      </Grid>
      <Grid container="flex" justifyContent="end" alignItems="center" gap={1.5}>
        <Text size="xxs" weight="light" color="gray100">
          {formatRelativeDate(lastMessageTime)}
        </Text>
        <More />
      </Grid>
    </StyledMessageItemWrapper>
  );
};

export const MessageList = ({ friends }: { friends: FriendResponse['friends'] }) => {
  return (
    <Box minHeight="100%" flexGrow={1}>
      <Grid as="ul" container="flex" direction="column">
        {friends.map((item, i) => (
          <MessageListItem
            key={item.id}
            isDark={i == 1}
            {...item.user}
            lastMessageTime={item.lastMessageTime?.toString() ?? null}
          />
        ))}
      </Grid>
    </Box>
  );
};

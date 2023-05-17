import { Grid } from '@/common/Grid';
import { darken } from 'polished';
import styled from 'styled-components';
import newSvg from '@/svgs/circle-sm.svg';
import { ReactComponent as More } from '@/svgs/more.svg';
import { Text } from '@/common/Text';
import { Avatar } from '@/common/Avatar';
import { formatRelativeDate } from '@/libs/utils';
import { User } from '@/types/entity';
import { UserStatus } from '@/dto/friend/response';
import { Dropbox, IconButton } from '@/common';

export interface MessageListItemProps {
  image: User['image'];
  nickname: User['nickname'];
  status?: UserStatus;
  lastMessageTime: string | null;
  isDark: boolean;
  setSelected: () => void;
  isNewMessage?: boolean;
}

export const MessageListItem = ({
  image,
  nickname,
  status,
  lastMessageTime,
  isDark,
  setSelected,
  isNewMessage,
}: MessageListItemProps) => {
  // const { requestMutation } = useFriendMutate();
  // const { blockedMutation } = useBlockedMutate();

  const items = [
    { label: '친구추가', onClick: () => console.log('친구추가') },
    { label: '차단', onClick: () => console.log('차단') },
    { label: '프로필', onClick: () => console.log('프로필') },
  ];
  return (
    <StyledMessageItemWrapper isDark={isDark} onClick={setSelected}>
      <Grid container="flex" alignItems="center">
        <Grid container="flex" direction="column" alignItems="center" size={{ width: '3rem' }}>
          {isNewMessage && <img src={newSvg} alt="new" />}
        </Grid>
        <Grid container="flex" alignItems="center" gap={1}>
          <Avatar size="md" src={image} />
          <Grid container="flex" direction="column" gap={0.5}>
            <Text size="xs" weight="light" color="gray100">
              {nickname}
            </Text>
            <Text size="xxs" weight="light" color="gray100">
              {status ?? 'Offline'}
            </Text>
          </Grid>
        </Grid>
      </Grid>
      <Grid container="flex" justifyContent="end" alignItems="center" gap={1.5}>
        <Text size="xxs" weight="light" color="gray100">
          {formatRelativeDate(lastMessageTime)}
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

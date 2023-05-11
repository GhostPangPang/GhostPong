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

export interface MessageListItemProps {
  id: User['id'];
  image: User['image'];
  nickname: User['nickname'];
  status?: UserStatus;
  lastMessageTime: string | null;
  isDark: boolean;
  setSelected: (id: number) => void;
}

export const MessageListItem = ({
  id = -1,
  image,
  nickname,
  status,
  lastMessageTime,
  isDark,
  setSelected,
}: MessageListItemProps) => {
  return (
    <StyledMessageItemWrapper isDark={isDark} onClick={() => setSelected(id)}>
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
              {status ?? 'Offline'}
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

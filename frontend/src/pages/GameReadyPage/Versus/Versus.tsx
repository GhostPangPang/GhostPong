import styled from 'styled-components';
import { Grid, Text, Dropbox, Ghost, GameButton as BaseGameButton } from '@/common';
import { ReactComponent as Crown } from '@/svgs/crown.svg';
import { MemberInfo } from '@/dto/channel/socket';
import { useUserInfo } from '@/hooks';
// import { PlayerInfo } from '../mock-data';

interface VersusProps {
  leftPlayer: MemberInfo | null;
  rightPlayer: MemberInfo | null;
  items: { label: string; onClick: () => void }[];
}
interface GhostBoxProps {
  player: MemberInfo;
  items: { label: string; onClick: () => void }[];
}

const NickNameText = styled(Text)`
  font-weight: bold;
  transition: background-color 0.3s, box-shadow 0.3s;
  color: ${({ theme }) => theme.color.foreground};
  cursor: pointer;
  &:hover {
    background-position: 0 0;
    transform: scale(1.1);
  }
`;

const GameButton = () => {
  return (
    <Grid container="flex" direction="row" alignItems="center" justifyContent="center">
      <BaseGameButton size="lg">
        <Text size="xl" weight="bold">
          참여하기
        </Text>
      </BaseGameButton>
    </Grid>
  );
};

const GhostBox = ({ player, items }: GhostBoxProps) => {
  const { userInfo } = useUserInfo();

  return (
    <Grid container="flex" direction="column" alignItems="center" justifyContent="center">
      <Grid
        container="flex"
        direction="row"
        alignItems="center"
        justifyContent="center"
        gap={1}
        size={{ height: '100%' }}
      >
        {player.role === 'owner' && <Crown />}
        {player.userId == userInfo.id ? (
          <NickNameText size="xxl">{player.nickname}</NickNameText>
        ) : (
          <Dropbox items={items} placement="bottomleft">
            <NickNameText size="xxl">{player.nickname}</NickNameText>
          </Dropbox>
        )}
      </Grid>
      <Grid gridColumn="2" alignSelf="center" justifySelf="center" size={{ height: '36rem', width: '36rem' }}>
        <Ghost />
      </Grid>
    </Grid>
  );
};

export const Versus = ({ leftPlayer, rightPlayer, items }: VersusProps) => {
  return (
    <Grid container="flex" direction="row" alignItems="center" justifyContent="center">
      {leftPlayer ? <GhostBox player={leftPlayer} items={items} /> : <GameButton />}
      <Text size="xxl" weight="bold">
        VS
      </Text>
      {rightPlayer ? <GhostBox player={rightPlayer} items={items} /> : <GameButton />}
    </Grid>
  );
};

import styled from 'styled-components';
import { Grid, Text, Dropbox, Ghost, GameButton as BaseGameButton } from '@/common';
import { ReactComponent as Crown } from '@/svgs/crown.svg';
import { PlayerInfo } from '../mock-data';

interface VersusProps {
  players: PlayerInfo[];
  currentUserId: number;
  items: { label: string; onClick: () => void }[];
}

interface GhostBoxProps {
  player: PlayerInfo;
  currentUserId: number;
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

const GhostBox = ({ player, currentUserId, items }: GhostBoxProps) => {
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
        {player.id == currentUserId ? (
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

export const Versus = ({ players, currentUserId, items }: VersusProps) => {
  const sortedPlayers = [...players].sort((a, b) => (b.role === 'owner' ? 1 : -1)); // owner가 먼저 나오도록 정렬

  return (
    <Grid container="flex" direction="row" alignItems="center" justifyContent="center">
      {sortedPlayers.length > 0 ? ( // players가 있으면 GhostBox, 없으면 GameButton
        <GhostBox player={sortedPlayers[0]} currentUserId={currentUserId} items={items} />
      ) : (
        <GameButton />
      )}
      <Text size="xxl" weight="bold">
        VS
      </Text>
      {sortedPlayers.length > 1 ? ( // players가 있으면 GhostBox, 없으면 GameButton
        <GhostBox player={sortedPlayers[1]} currentUserId={currentUserId} items={items} />
      ) : (
        <GameButton />
      )}
    </Grid>
  );
};

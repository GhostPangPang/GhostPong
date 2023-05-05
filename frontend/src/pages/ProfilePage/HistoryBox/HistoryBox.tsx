import { useState } from 'react';
import styled from 'styled-components';
import { Grid } from '@/layout/Grid';
import { Box } from '@/common/Box';
import { Text } from '@/common/Text';
import { Avatar } from '@/common/Avatar';
import { RankBadge } from '@/common/RankBadge';
import { getRank } from '@/libs/utils/rank';
import { darken, lighten } from 'polished';
import { historyMockData, HistoryProps, Player } from './history-mock-data';
const { histories, histories_fetch } = historyMockData;

export interface HistoryItemProps extends HistoryProps {
  color?: string;
}

export interface VersusBoxProps {
  winner: Player;
  loser: Player;
}

export interface PlayerInfoProps {
  player: Player;
}

// button으로 하면 이상하게 렌더링 됨
// 따라서 수정 예정
const MoreButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 4rem;
  align-items: end;
  background-color: rgb(74, 74, 74);
  color: rgb(255, 255, 255);
  width: 100%;
  height: 4.8rem;
  padding: 0.8rem 1.6rem;
  cursor: pointer;
  &:hover {
    background: ${(props) => lighten(0.1, props.theme.color.surface)};
  }
  &:active {
    background: ${(props) => darken(0.1, props.theme.color.surface)};
  }
`;

const HistoryItemStyled = styled.article`
  background-color: ${({ color }) => color};
  height: 100%;
  width: 100%;
`;

const RightPlayerInfo = ({ player }: PlayerInfoProps) => {
  const Rank = getRank(player.exp);
  return (
    <Grid container="flex" direction="column" justifyContent="center" alignItems="end">
      <Text size="md">{player.nickname}</Text>
      <Grid container="flex" direction="row" alignItems="center">
        <RankBadge rank={Rank} height="24" width="24" />
        <Text size="xs">{Rank}</Text>
      </Grid>
    </Grid>
  );
};

const LeftPlayerInfo = ({ player }: PlayerInfoProps) => {
  const Rank = getRank(player.exp);
  return (
    <Grid container="flex" direction="column" justifyContent="center" alignItems="start">
      <Text size="md">{player.nickname}</Text>
      <Grid container="flex" direction="row" alignItems="center">
        <RankBadge rank={Rank} height="24" width="24" />
        <Text size="xs">{Rank}</Text>
      </Grid>
    </Grid>
  );
};

const VersusBox = ({ winner, loser }: VersusBoxProps) => {
  return (
    <Grid container="flex" direction="row" justifyContent="center" alignItems="center" columnGap={3}>
      <RightPlayerInfo player={winner} />
      <Avatar size="lg" />
      <Text size="sm">VS</Text>
      <Avatar size="lg" />
      <LeftPlayerInfo player={loser} />
    </Grid>
  );
};

const HistoryItem = ({ color, winner, loser, winnerScore, loserScore, createdAt }: HistoryItemProps) => {
  return (
    <HistoryItemStyled color={color}>
      <Grid container="flex" direction="column" height="100%" size={{ height: '100%', padding: 'md' }}>
        <Text size="sm">3 days ago</Text>
        <Grid
          container="flex"
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap={4}
          size={{ height: '100%', padding: 3.2 }}
        >
          <Text size="xxl" weight="bold">
            {winnerScore.toString()}
          </Text>
          <VersusBox winner={winner} loser={loser} />
          <Text size="xxl" weight="bold">
            {loserScore.toString()}
          </Text>
        </Grid>
      </Grid>
    </HistoryItemStyled>
  );
};

export const HistroyBox = () => {
  const [history, setHistory] = useState<HistoryProps[]>(histories);
  const handleMoreButtonClick = () => {
    // fetch additional 5 histories here...
    const newHistories: HistoryProps[] = histories_fetch;
    setHistory((prevHistories: HistoryProps[]) => prevHistories.concat(newHistories));
  };
  return (
    <Box as="section" height="100%" width="100%">
      <Grid container="flex" direction="column" justifyContent="start" alignItems="start">
        <Grid
          container="flex"
          justifyContent="space-between"
          alignItems="center"
          size={{ height: '100%', padding: 'lg' }}
        >
          <Text size="lg">히스토리</Text>
        </Grid>
        {history.map((history: HistoryProps, index: number) => {
          if (index % 2 !== 0) {
            return (
              <HistoryItem
                key={history.id}
                id={history.id}
                winner={history.winner}
                loser={history.loser}
                winnerScore={history.winnerScore}
                loserScore={history.loserScore}
                createdAt={history.createdAt}
              />
            );
          } else {
            return (
              <HistoryItem
                key={history.id}
                id={history.id}
                color="#3d3d3d"
                winner={history.winner}
                loser={history.loser}
                winnerScore={history.winnerScore}
                loserScore={history.loserScore}
                createdAt={history.createdAt}
              />
            );
          }
        })}
      </Grid>
      <MoreButton onClick={handleMoreButtonClick}>. . .</MoreButton>
    </Box>
  );
};

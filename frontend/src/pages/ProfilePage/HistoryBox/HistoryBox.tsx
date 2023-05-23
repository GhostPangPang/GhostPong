import styled from 'styled-components';
import { Grid, Box, Text, Avatar, RankBadge } from '@/common';
import { getRank } from '@/libs/utils/rank';
import { useHistoryData, UserHistoryResponse, UserInfo } from '@/hooks/user/useHistroyData';
import { formatRelativeDate } from '@/libs/utils/date';

type HistoryItem = UserHistoryResponse['histories'][number];
export interface HistoryItemProps extends HistoryItem {
  color?: string;
}

const HistoryItemStyled = styled.article`
  background-color: ${({ color }) => color};
  height: 100%;
  width: 100%;
`;

const RightPlayerInfo = ({ player }: { player: UserInfo }) => {
  const Rank = getRank(player.exp);
  return (
    <Grid container="flex" direction="column" justifyContent="center" alignItems="end">
      <Text size="md">{player.nickname}</Text>
      <Grid container="flex" direction="row" justifyContent="end" alignItems="center">
        <RankBadge rank={Rank} height="24" width="24" />
        <Text size="xs">{Rank}</Text>
      </Grid>
    </Grid>
  );
};

const LeftPlayerInfo = ({ player }: { player: UserInfo }) => {
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

const VersusBox = ({ winner, loser }: { winner: UserInfo; loser: UserInfo }) => {
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
        <Text size="sm">{formatRelativeDate(createdAt)}</Text>
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
  const userId = 1;
  console.log(userId);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useHistoryData(userId);

  return (
    <Box as="section" height="100%" width="100rem">
      <Grid container="flex" direction="column" justifyContent="start" alignItems="start">
        <Grid
          container="flex"
          justifyContent="space-between"
          alignItems="center"
          size={{ height: '100%', padding: 'lg' }}
        >
          <Text size="lg">히스토리</Text>
        </Grid>
        {data.pages.map((page) =>
          page.histories.map((history, index) => {
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
          }),
        )}
      </Grid>
      <button onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
        {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Load More' : 'Nothing more to load'}
      </button>
    </Box>
  );
};

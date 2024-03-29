import { ProgressBar } from '..';
import { useMemo } from 'react';
import { Grid, RankBadge } from '@/common';
import { getRank, getRankRange } from '@/libs/utils/rank';

export interface RankProgressBarProps {
  exp: number;
}

export const RankProgressBar = ({ exp = 0 }: RankProgressBarProps) => {
  const rank = useMemo(() => getRank(exp), [exp]);
  const [minExp, maxExp] = useMemo(() => getRankRange(rank), [rank]);
  const percentage = useMemo(() => {
    return Math.floor(((exp - minExp) / (maxExp - minExp)) * 100);
  }, [exp]);

  return (
    <Grid container="flex" alignItems="center">
      <RankBadge rank={rank} size="md" style={{ left: '1rem' }} />
      <ProgressBar percentage={percentage} msg={rank} />
    </Grid>
  );
};

import { Grid } from '@/layout/Grid';
import { Text } from '@/common/Text';
import { Avatar } from '@/common/Avatar';
import { InfoBox } from './InfoBox';
import { AchievementBox } from './AchievementBox';
import { HistroyBox } from './HistoryBox';
import { RankBadge, getRank } from '../RankUtil';
import { useMemo } from 'react';
import { ReactComponent as Achievement1 } from '@/svgs/achievment1.svg';
import { ReactComponent as Achievement2 } from '@/svgs/achievment2.svg';

import { profileMockData } from './profile-mock-data';

export const ProfilePage = () => {
  // mock data
  const { id, nickname, image, exp, winCount, loseCount, achievements } = profileMockData;
  const rank = useMemo(() => getRank(exp), [exp]);
  const winRate = useMemo(() => ((winCount / (winCount + loseCount)) * 100).toFixed(1), [winCount, loseCount]);

  // 자신의 id인지 확인하는 절차가 필요함
  return (
    <Grid container="flex" direction="column" rowGap={1.5} size={{ maxWidth: '100rem' }}>
      <Grid container="flex" justifyContent="start" alignItems="end">
        <Avatar size="xl" src={image} borderColor="gradient" />
        <Text size="xxl">{nickname}</Text>
      </Grid>
      <Grid container="flex" direction="row" justifyContent="space-between" alignItems="center" columnGap={2}>
        <InfoBox title="랭크" desc={rank} component={<RankBadge rank={rank} width="100%" />} />
        <InfoBox title="승률" desc={`${winRate}%`} subDesc={`${winCount}승 ${loseCount}패`} />
        <InfoBox title="경험치" desc={exp.toString()} subDesc="exp" />
      </Grid>
      <Grid container="flex" direction="row" justifyContent="start" alignItems="center">
        <AchievementBox>
          <Achievement1 height="inherit" />
          <Achievement2 height="inherit" />
        </AchievementBox>
      </Grid>
      <Grid container="flex" direction="column">
        <HistroyBox />
      </Grid>
    </Grid>
  );
};

import { getRank } from '@/libs/utils/rank';
import { Grid, Text, RankBadge, Avatar } from '@/common';
import { InfoBox } from './InfoBox';
import { AchievementBox } from './AchievementBox';
import { HistroyBox } from './HistoryBox';
import { useMemo, useEffect, useState } from 'react';
import { ReactComponent as Achievement1 } from '@/svgs/achievment1.svg';
import { ReactComponent as Achievement2 } from '@/svgs/achievment2.svg';
import { useProfileData } from '@/hooks/user/useProfileData';
import { useLocation } from 'react-router-dom';

export const ProfilePage = () => {
  const { pathname } = useLocation();
  const [userId, setUserId] = useState(0);
  useEffect(() => {
    setUserId(Number(pathname.replace('/profile/', '')));
  }, []);

  // useQuery는 컴포넌트가 마운트될 때 자동으로 데이터를 조회하므로 따로 useEffect를 사용하여 데이터를 조회할 필요는 없습니다.
  const data = useProfileData(userId);

  const rank = useMemo(() => getRank(data.exp), [data.exp]);
  const winRate = useMemo(
    () =>
      (data.winCount == 0 && data.loseCount == 0
        ? 0
        : (data.winCount / (data.winCount + data.loseCount)) * 100
      ).toFixed(1),
    [data.winCount, data.loseCount],
  );

  // 자신의 id인지 확인하는 절차가 필요함
  return (
    // media query 100rem 이하일 때
    <Grid container="flex" direction="column" rowGap={1.5} size={{ maxWidth: '100rem' }}>
      <Grid container="flex" justifyContent="start" alignItems="end">
        <Avatar size="xl" src={data.image} borderColor="gradient" />
        <Text size="xxl">{data.nickname}</Text>
      </Grid>
      <Grid container="flex" direction="row" justifyContent="space-between" alignItems="center" gap={2}>
        <InfoBox title="랭크" desc={rank} component={<RankBadge rank={rank} size="xl" />} />
        <InfoBox title="승률" desc={`${winRate}%`} subDesc={`${data.winCount}승 ${data.loseCount}패`} />
        <InfoBox title="경험치" desc={(data.exp * 100).toString()} subDesc="exp" />
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

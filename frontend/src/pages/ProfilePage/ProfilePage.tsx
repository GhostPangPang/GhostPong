import { getRank } from '@/libs/utils/rank';
import { Grid, Text, RankBadge, Avatar, CommonButton } from '@/common';
import { InfoBox } from './InfoBox';
import { AchievementBox } from './AchievementBox';
import { HistroyBox } from './HistoryBox';
import { useMemo, useEffect, useState } from 'react';
import { useProfileData, useFriendMutation, useBlockedMutation, useAuth } from '@/hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import { ReactComponent as SettingIcon } from '@/svgs/setting.svg';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const {
    userInfo: { id },
  } = useAuth();
  const [userId, setUserId] = useState(0);
  const { requestFriend } = useFriendMutation();
  const { updateBlocked } = useBlockedMutation();

  useEffect(() => {
    setUserId(Number(pathname.replace('/profile/', '')));
  }, [pathname]);

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
      <Grid as="section" container="flex" justifyContent="space-between">
        <Grid container="flex" justifyContent="start" alignItems="end">
          <Avatar size="xl" src={data.image} borderColor="gradient" />
          <Text size="xxl">{data.nickname}</Text>
        </Grid>
        {id === userId ? (
          <SettingIcon onClick={() => navigate('/profile/edit')} style={{ cursor: 'pointer' }} />
        ) : (
          <Grid container="flex" justifyContent="end" alignItems="end" gap={1}>
            <CommonButton size="sm" onClick={() => requestFriend(userId)}>
              친구신청
            </CommonButton>
            <CommonButton size="sm" onClick={() => updateBlocked(userId)}>
              친구차단
            </CommonButton>
          </Grid>
        )}
      </Grid>
      <Grid container="flex" direction="row" justifyContent="space-between" alignItems="center" gap={2}>
        <InfoBox title="랭크" desc={rank} component={<RankBadge rank={rank} size="xl" />} />
        <InfoBox title="승률" desc={`${winRate}%`} subDesc={`${data.winCount}승 ${data.loseCount}패`} />
        <InfoBox title="경험치" desc={(data.exp * 100).toString()} subDesc="exp" />
      </Grid>
      <Grid container="flex" direction="row" justifyContent="start" alignItems="center">
        <AchievementBox achievements={data.achievements} />
      </Grid>
      <Grid container="flex" direction="column">
        <HistroyBox userId={userId} />
      </Grid>
    </Grid>
  );
};

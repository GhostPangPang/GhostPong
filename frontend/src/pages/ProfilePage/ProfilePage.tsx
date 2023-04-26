import { Grid } from '@/layout/Grid';
import { Text } from '@/common/Text';
import { Avatar } from '@/common/Avatar';
import { InfoBox } from './InfoBox';
import { AchievementBox } from './AchievementBox';
import { HistroyBox } from './HistoryBox';

import { ReactComponent as Gold } from '@/svgs/tmpgold.svg';
import { ReactComponent as Achievement1 } from '@/svgs/achievment1.svg';
import { ReactComponent as Achievement2 } from '@/svgs/achievment2.svg';

// overflow-y: auto; 어떻게 하지?
export const ProfilePage = () => {
  return (
    <Grid container="flex" direction="column" rowGap={1.5} size={{ maxWidth: '100rem' }}>
      <Grid container="flex" justifyContent="start" alignItems="end">
        <Avatar size="xl" />
        <Text size="xxl">AlvinLee</Text>
      </Grid>
      <Grid container="flex" direction="row" justifyContent="space-between" alignItems="center" columnGap={2}>
        <InfoBox title="랭크" desc="Gold" component={<Gold height="inherit" />} />
        <InfoBox title="승률" desc="73.3%" subDesc="(22승 8패)" />
        <InfoBox title="경험치" desc="21000" subDesc="exp" />
      </Grid>
      <Grid container="flex" direction="row" justifyContent="start" alignItems="center">
        <AchievementBox>
          <Achievement1 height="inherit" />
          <Achievement2 height="inherit" />
        </AchievementBox>
      </Grid>
      <Grid container="flex" direction="row" justifyContent="start" alignItems="center">
        {/* <HistroyBox /> */}
      </Grid>
    </Grid>
  );
};

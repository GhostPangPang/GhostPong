import { Grid, Text, IconButton } from '@/common';
import { ReactComponent as Lock } from '@/svgs/lock.svg';
import { ReactComponent as Out } from '@/svgs/out.svg';
import { useRecoilValue } from 'recoil';
import { channelDataState, channelIdState } from '@/stores';
import { useLeaveChannel } from '@/hooks/channel';
import { useNavigate } from 'react-router-dom';

export const RoomInfo = () => {
  const channelData = useRecoilValue(channelDataState);
  const channelId = useRecoilValue(channelIdState);
  const navigate = useNavigate();
  const { leaveChannel } = useLeaveChannel();
  const handleOut = () => {
    leaveChannel(channelId);
    navigate('/channel/list');
  };

  return (
    <Grid
      container="flex"
      direction="row"
      alignItems="start"
      justifyContent="space-between"
      size={{ height: '100%', padding: 'md' }}
    >
      <IconButton onClick={handleOut}>
        <Out />
      </IconButton>
      <Grid container="flex" direction="row" alignItems="center" justifyContent="end">
        <Lock />
        <Text size="lg">{channelData.name}</Text>
      </Grid>
    </Grid>
  );
};

import { Grid, Text, IconButton, Modal } from '@/common';
import { ReactComponent as Lock } from '@/svgs/lock.svg';
import { ReactComponent as Out } from '@/svgs/out.svg';
import { ReactComponent as Setting } from '@/svgs/setting.svg';
import { useRecoilValue } from 'recoil';
import { currentRoleSelector, channelDataState, channelIdState } from '@/stores';
import { useState } from 'react';
import { SettingModal } from '../SettingModal';
import { useLeaveChannel } from '@/hooks/channel';
import { useNavigate } from 'react-router-dom';

export const RoomInfo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const channelData = useRecoilValue(channelDataState);
  const channelId = useRecoilValue(channelIdState);
  const currentRole = useRecoilValue(currentRoleSelector);

  const navigate = useNavigate();
  const { leaveChannel } = useLeaveChannel();

  const handleOut = () => {
    if (confirm('정말로 나가시겠습니까?')) {
      leaveChannel(channelId);
      navigate('/channel/list');
    } else {
      return;
    }
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
      <Grid container="flex" direction="row" alignItems="center" justifyContent="end" gap={1}>
        <Lock />
        <Text size="lg">{channelData.name}</Text>
        {currentRole === 'owner' ? (
          <>
            <Setting onClick={() => setIsOpen(true)} style={{ cursor: 'pointer' }} />
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <SettingModal setIsOpen={setIsOpen} />
            </Modal>
          </>
        ) : null}
      </Grid>
    </Grid>
  );
};

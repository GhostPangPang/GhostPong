import { emitEvent } from '@/libs/api';

export const useLeaveChannel = () => {
  const leaveChannel = (id: string) => {
    emitEvent('leave-channel', { channelId: id });
  };
  return { leaveChannel };
};

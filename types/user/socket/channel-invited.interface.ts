import { ChannelMode } from '@/types/channel';

export interface ChannelInvited {
  channelId: string;
  nickname: string;
  mode: ChannelMode;
  password?: string;
}

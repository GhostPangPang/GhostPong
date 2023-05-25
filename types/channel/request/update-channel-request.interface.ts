import { ChannelMode } from '../response';

export interface UpdateChannelRequest {
  mode: ChannelMode;
  password?: string;
}

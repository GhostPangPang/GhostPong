export type ChannelMode = 'private' | 'public' | 'protected';

export interface ChannelInfo {
  id: string;
  name: string;
  mode: ChannelMode;
  count: number;
}

export interface ChannelsListResponse {
  total?: number;
  channels: ChannelInfo[];
}

export interface ChannelInfo {
  id: string;
  name: string;
  mode: string;
  count: number;
}

export interface ChannelsListResponse {
  total?: number;
  channels: ChannelInfo[];
}

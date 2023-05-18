export interface ChannelsListResponse {
  total?: number;
  channels: {
    id: string;
    name: string;
    mode: string;
    count: number;
  }[];
}

class ChannelInfo {
  id: string;
  name: string;
  mode: string;
  count: number;
}

export class ChannelsListResponseDto {
  total?: number;
  channels: ChannelInfo[];
}

import { ChannelInfo, ChannelsListResponse } from '@/types/channel/response';

export class ChannelsListResponseDto implements ChannelsListResponse {
  /**
   * 총 채널 수
   * @example 10
   */
  total?: number;

  /**
   * 채널 목록
   */
  channels: ChannelInfo[];
}

import { IsString, Length } from 'class-validator';

import { ChannelId } from '@/types/channel';

export class ChannelIdDto implements ChannelId {
  /**
   * @description 채널 아이디
   */
  @IsString()
  @Length(21, 21)
  channelId: string;
}

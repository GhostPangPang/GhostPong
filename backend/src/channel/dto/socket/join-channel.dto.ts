import { IsNumber, IsString, Max, Min } from 'class-validator';

import { JoinChannel } from '@/types/channel/socket';

export class JoinChannelDto implements JoinChannel {
  /**
   * @description 채널 nanoid ID
   */
  @IsString()
  channelId: string;

  /**
   * @description 유저 ID
   * @example 1
   */
  @IsNumber()
  @Min(1)
  @Max(2147483647)
  userId: number;
}

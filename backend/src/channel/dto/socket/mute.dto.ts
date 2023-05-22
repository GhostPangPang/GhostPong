import { IsInt, IsString, Max, Min } from 'class-validator';

import { Mute } from '@/types/channel/socket';

export class MuteDto implements Mute {
  /**
   * @description 채널 아이디
   * @example 4
   */
  @IsString()
  channelId: string;

  /**
   * @description 채팅 보낸 사람 아이디
   * @example 4
   */
  @IsInt()
  @Min(1)
  @Max(2147483647)
  targetId: number;
}

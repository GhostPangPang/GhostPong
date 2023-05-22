import { IsInt, IsString, Length, Max, Min } from 'class-validator';

import { Operation } from '@/types/channel/socket';

export class OperationDto implements Operation {
  /**
   * @description 채널 아이디
   * @example 4
   */
  @IsString()
  @Length(21, 21)
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

import { IsDateString, IsInt, IsNotEmpty, Max, Min } from 'class-validator';

import { LastMessageView } from '@/types/message/socket/last-message-view.interface';

export class LastMessageViewDto implements LastMessageView {
  /**
   * @description 친구 관계 아이디
   * @example 1
   */
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(2147483647)
  friendId: number;

  /**
   * @description 마지막으로 읽은 메세지의 sendingTime
   * @example 2020-12-12T12:12:12
   */
  @IsDateString()
  lastViewTime: Date | string;
}

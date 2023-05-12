import { IsNotEmpty, IsNumber, IsString, Max, Min, ValidateIf } from 'class-validator';

import { LastMessageView } from '@/types/message/socket/last-message-view.interface';

export class LastMessageViewDto implements LastMessageView {
  /**
   * @description 친구 관계 아이디
   * @example 1
   */
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(2147483647)
  friendId: number;

  /**
   * @description 마지막으로 읽은 메세지의 sendingTime
   * @example 2020-12-12T12:12:12
   */
  @ValidateIf((object, value) => typeof value === 'string' || value instanceof Date)
  @IsString({ message: 'lastViewTime must be a string or a Date' })
  lastViewTime: Date | string;
}

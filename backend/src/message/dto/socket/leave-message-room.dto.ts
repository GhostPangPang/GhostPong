import { IsDate, IsNotEmpty, IsNumber, Max, Min, ValidateIf } from 'class-validator';

import { LeaveMessageRoom } from '@/types/message/socket/leave-message-room.interface';

export class LeaveMessageRoomDto implements LeaveMessageRoom {
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
  @ValidateIf((object, value) => typeof value === 'string')
  @IsDate()
  lastViewTime: Date | string;
}

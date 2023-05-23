import { IsDateString, IsInt, IsNotEmpty, IsString, Max, MaxLength, Min } from 'class-validator';

import { Message } from '@/types/message/socket';

export class MesssageDto implements Message {
  /**
   * @description 친구 관계 아이디
   * @example 1
   */
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(2147483647)
  id: number;

  /**
   * @description 메시지 받을 사람 아이디
   * @example 4
   */
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(2147483647)
  receiverId: number;

  /**
   * @description 메시지 보낸 시간
   * @example '2021-08-01T00:00:00'
   */
  @IsDateString()
  createdAt: Date | string;

  /**
   * @description 메시지 내용
   * @example '안녕하세요'
   */
  @IsString()
  @MaxLength(512)
  content: string;
}

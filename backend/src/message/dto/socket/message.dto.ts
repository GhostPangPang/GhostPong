import { IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min } from 'class-validator';

import { Message } from '@/types/message/socket';

export class MesssageDto implements Message {
  /**
   * @description 친구 관계 아이디
   * @example 1
   */
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(2147483647)
  id: number;

  /**
   * @description 메시지 내용
   * @example '안녕하세요'
   */
  @IsString()
  @MaxLength(512)
  content: string;
}

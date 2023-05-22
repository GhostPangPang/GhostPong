import { IsDateString, IsNotEmpty, IsNumber, IsString, Length, Max, MaxLength, Min } from 'class-validator';

import { Chat } from '@/types/channel/socket';

export default class ChatDto implements Chat {
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
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(2147483647)
  senderId: number;

  /**
   * @description 채팅 보낸 시간
   * @example '2021-08-01T00:00:00'
   */
  @IsDateString()
  createdAt: Date | string;

  /**
   * @description 채팅 내용
   * @example '안녕하세요'
   */
  @IsString()
  @MaxLength(512)
  content: string;
}

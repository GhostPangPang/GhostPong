import { IsDateString, IsString, MaxLength, Length } from 'class-validator';

import { SendChat } from '@/types/channel/socket';

export default class SendChatDto implements SendChat {
  /**
   * @description 채널 아이디
   * @example 4
   */
  @IsString()
  @Length(21, 21)
  channelId: string;

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

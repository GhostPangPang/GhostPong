import { IsString, MaxLength, Length } from 'class-validator';

import { SendChat } from '@/types/channel/socket';

export class SendChatDto implements SendChat {
  /**
   * @description 채널 아이디
   * @example 4
   */
  @IsString()
  @Length(21, 21)
  channelId: string;

  /**
   * @description 채팅 내용
   * @example '안녕하세요'
   */
  @IsString()
  @MaxLength(512)
  content: string;
}

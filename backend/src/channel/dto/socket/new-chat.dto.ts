import { IsDateString, IsString, MaxLength, Length, IsInt, Min, Max, Matches } from 'class-validator';

import { NewChat } from '@/types/channel/socket';

export default class NewChatDto implements NewChat {
  /**
   * @description 채널 아이디
   * @example 'djd342djf'
   */
  @IsString()
  @Length(21, 21)
  channelId: string;

  /**
   * @description 수신자 아이디
   * @example 4
   */
  @IsInt()
  @Min(1)
  @Max(2147483647)
  senderId: number;

  /**
   * @description 수신자 닉네임
   * @example 'san'
   */
  @Matches(/^[가-힣a-zA-Z0-9]{1,8}$/, { message: '유효하지 않은 닉네임 입니다.' })
  senderNickname: string;

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

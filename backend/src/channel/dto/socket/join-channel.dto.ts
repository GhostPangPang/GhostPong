import { IsNumber, IsString, Matches, Max, Min } from 'class-validator';

import { JoinChannel } from '@/types/channel/socket';

export class JoinChannelDto implements JoinChannel {
  /**
   * @description 채널 nanoid ID
   */
  @IsString()
  channelId: string;

  /**
   * @description 유저 ID
   * @example 1
   */
  @IsNumber()
  @Min(1)
  @Max(2147483647)
  userId: number;

  /**
   * @description 유저 닉네임
   * @example 'hannkim'
   */
  @Matches(/^[가-힣a-zA-Z0-9]{1,8}$/, { message: '유효하지 않은 닉네임 입니다.' })
  nickname: string;

  /**
   * @description 유저 이미지 url
   * @example '/asset/profile-1.jpg'
   */
  @IsString()
  image: string;
}

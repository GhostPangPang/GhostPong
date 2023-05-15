import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsString, Length, Matches, Max, Min, ValidateNested } from 'class-validator';

import { ChannelMode } from '../../../repository/model/channel';
import { IsChannelPassword } from '../decorator/is-password-required.decorator';

class ChannelUser {
  /**
   * 유저 id
   * @example 1
   */
  @IsNumber()
  @Min(1)
  @Max(2147483647)
  id: number;

  /**
   * 유저 닉네임
   * @example '김유저'
   */
  @Matches(/^[가-힣a-zA-Z0-9]{1,8}$/, { message: '유효하지 않은 닉네임 입니다.' })
  nickname: string;

  /**
   * 유저 이미지 url
   * @example '/asset/profile-3.png'
   */
  @IsString()
  @Length(1, 256)
  image: string;
}

export class CreateChannelRequestDto {
  /**
   * printable ascii, 한글 3~19자의 이름
   * @example '아무나 오세요~'
   */
  @Matches(/^[\x20-\x7E가-힣]{3,19}$/, { message: '유효하지 않은 이름입니다.' })
  name: string;

  /**
   * channel 의 모드 (public, protected, private)
   * @example 'public'
   */
  @IsIn(['public', 'protected', 'private'], { message: '유효하지 않은 모드입니다.' })
  mode: ChannelMode;

  /**
   * channel 의 password. mode 가 protected 일 때만 있어야 한다.
   * @example '1234'
   */
  @IsChannelPassword()
  password?: string;

  /**
   * channel 을 만든 방장의 정보
   */
  @Type(() => ChannelUser)
  @ValidateNested({ message: 'nested error' })
  user: ChannelUser;
}

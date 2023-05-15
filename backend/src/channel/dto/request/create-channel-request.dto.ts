import { IsIn, Matches } from 'class-validator';

import { ChannelMode } from '../../../repository/model/channel';
import { IsChannelPassword } from '../decorator/is-password-required.decorator';

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
}

import { IsIn } from 'class-validator';

import { UpdateChannelRequest } from '@/types/channel';

import { IsChannelPassword } from '../decorator/is-password-required.decorator';

export class UpdateChannelRequestDto implements UpdateChannelRequest {
  /**
   * channel 의 모드 (public, protected, private)
   * @example 'public'
   */
  @IsIn(['public', 'protected', 'private'], { message: '유효하지 않은 모드입니다.' })
  mode: 'public' | 'protected' | 'private';

  /**
   * channel 의 password. mode 가 protected 일 때만 있어야 한다.
   * @example '1234'
   */
  @IsChannelPassword()
  password?: string;
}

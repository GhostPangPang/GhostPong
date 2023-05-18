import { IsIn } from 'class-validator';

import { JoinChannelRequest } from '@/types/channel/request';

import { ChannelMode } from '../../../repository/model/channel';
import { IsChannelPassword } from '../decorator/is-password-required.decorator';

export class JoinChannelRequestDto implements JoinChannelRequest {
  @IsIn(['public', 'protected', 'private'], { message: '유효하지 않은 모드입니다.' })
  mode: ChannelMode;

  /**
   * channel의 password. mode가 protected일 때만 있어야 한다.
   * @example '1234'
   */
  @IsChannelPassword()
  password?: string;
}

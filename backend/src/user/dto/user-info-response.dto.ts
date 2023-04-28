import { UserInfoResponse } from '@/types/user/response';

import { UserInfoDto } from './user-info.dto';

export class UserInfoResponseDto extends UserInfoDto implements UserInfoResponse {
  /**
   * 유저가 차단한 사람들의 id
   * @example [23, 35, 82]
   */
  blockedUsers: number[];
}

import { UserProfileResponse } from '@/types/user/response';

import { UserInfoDto } from '../user-info.dto';

export class UserProfileResponseDto extends UserInfoDto implements UserProfileResponse {
  /**
   * 유저 승리 횟수
   * @example 12
   */
  winCount: number;

  /**
   * 유저 패배 횟수
   * @example 12
   */
  loseCount: number;

  /**
   * 유저 업적 목록
   * @example [ 1, 2, 3 ]
   */
  achievements: number[];
}

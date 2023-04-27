import { BlockedUserResponse } from '@/types/blocked/response/blocked-user-response.interface';

import { UserInfoDto } from '../../user/dto/user-info.dto';
export class BlockedUserResponseDto implements BlockedUserResponse {
  /**
   * 차단한 유저 리스트
   */
  blocked: UserInfoDto[];
}

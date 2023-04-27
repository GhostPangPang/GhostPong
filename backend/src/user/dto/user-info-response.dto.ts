import { UserInfoDto } from './user-info.dto';

export class UserInfoResponseDto extends UserInfoDto {
  /**
   * 유저가 차단한 사람들의 id
   * @example [23, 35, 82]
   */
  blockedUsers: number[];
}

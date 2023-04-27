import { UserProfileResponse } from '@/types/user/user-profile-response.interface';

export class UserProfileResponseDto implements UserProfileResponse {
  /**
   * 유저 닉네임
   * @example nickname
   */
  nickname: string;

  /**
   * 유저 프로필 이미지
   * @example /asset/3-profile.png
   */
  image: string;

  /**
   * 유저 레벨
   * @example 12
   */
  exp: number;

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

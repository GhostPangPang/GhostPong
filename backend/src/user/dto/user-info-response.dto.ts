export class UserInfoResponseDto {
  /**
   * 현재 로그인한 유저의 닉네임
   * @example 'san'
   */
  nickname: string;

  /**
   * 유저의 프로필 사진 url
   * @example '/asset/profile-1.jpg'
   */
  image: string;

  /**
   * 유저의 경험치
   * @example 42
   */
  exp: number;

  /**
   * 유저가 차단한 사람들의 id
   * @example [23, 35, 82]
   */
  blockedUsers: number[];
}

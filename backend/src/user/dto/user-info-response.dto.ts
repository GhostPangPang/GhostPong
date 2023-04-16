import { User } from '../../entity/user.entity';

export class UserInfoResponseDto {
  constructor(user: User, numbers: number[]) {
    this.nickname = user.nickname;
    this.image = user.image;
    this.exp = user.exp;
    this.blockedUsers = numbers;
  }
  /**
   * 현재 로그인한 유저의 닉네임
   * @example 'san'
   */
  nickname: string;

  /**
   * 유저의 프로필 사진 url
   * @example '/src/.../...'
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

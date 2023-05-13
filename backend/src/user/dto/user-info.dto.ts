import { UserInfo } from '@/types/user';

export class UserInfoDto implements UserInfo {
  /**
   * 유저 id
   * @example 1
   */
  id?: number;

  /**
   * 유저 닉네임
   * @example 'jiskim'
   */
  nickname: string;

  /**
   * 유저 이미지 url
   * @example '/asset/profile-1.jpg'
   */
  image?: string;

  /**
   * 유저 경험치
   * @example 1000
   */
  exp: number;
}

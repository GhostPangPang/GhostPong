import { UserNicknameResponse } from '@/types/user/response';

export class UserNicknameResponseDto implements UserNicknameResponse {
  constructor(nickname: string) {
    this.nickname = nickname;
  }
  /**
   * nickname
   * @example 'san1'
   */
  nickname: string;
}

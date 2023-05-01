import { UserNicknameResponse } from '@/types/user/response';

export class UserNicknameResponseDto implements UserNicknameResponse {
  /**
   * nickname
   * @example 'san1'
   */
  nickname: string;
}

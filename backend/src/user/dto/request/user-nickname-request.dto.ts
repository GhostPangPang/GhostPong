import { Matches } from 'class-validator';

import { UserNickname } from '@/types/user/request';

export class UserNicknameRequestDto implements UserNickname {
  /**
   * nickname
   * @example 'san1'
   */
  @Matches(/^[가-힣a-zA-Z0-9]{1,8}$/, { message: '유효하지 않은 닉네임 입니다.' })
  nickname: string;
}

import { UserNicknameRequest } from '@/types/user/request';

import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class UserNicknameRequestDto implements UserNicknameRequest {
  /**
   * nickname
   * @example 'san1'
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(8)
  @Matches(/^[가-힣a-zA-Z0-9]*$/)
  nickname: string;
}

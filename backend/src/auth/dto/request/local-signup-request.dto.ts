import { IsEmail, IsString, Matches } from 'class-validator';

import { LocalSignUpRequest } from '@/types/auth/request';

export class LocalSignUpRequestDto implements LocalSignUpRequest {
  @IsEmail()
  email: string;

  // TODO @IsStrongPassword()
  @IsString()
  password: string;

  /**
   * nickname
   * @example 'san1'
   */
  @Matches(/^[가-힣a-zA-Z0-9]{1,8}$/, { message: '유효하지 않은 닉네임 입니다.' })
  nickname: string;
}

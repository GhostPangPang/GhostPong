import { IsEmail, IsStrongPassword } from 'class-validator';

import { LocalLoginRequest } from '@/types/auth/request';

export class LocalLoginRequestDto implements LocalLoginRequest {
  /**
   * 이메일
   * @example 'sample@sample.com'
   */
  @IsEmail()
  email: string;

  /**
   * 비밀번호
   * @example 'sample1234'
   */
  @IsStrongPassword()
  password: string;
}

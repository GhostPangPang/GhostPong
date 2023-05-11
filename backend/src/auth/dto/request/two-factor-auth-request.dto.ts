import { IsEmail, IsNotEmpty } from 'class-validator';

import { TwoFactorAuthRequest } from '@/types/auth/request';

export class TwoFactorAuthRequestDto implements TwoFactorAuthRequest {
  /**
   * 2단계 인증 설정할 이메일
   * @example 'email@email.com'
   */
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

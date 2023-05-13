import { TwoFactorAuthResponse } from '@/types/auth/response';

export class TwoFactorAuthResponseDto implements TwoFactorAuthResponse {
  /**
   * 2단계 인증 이메일
   * @example 'email@email.com' | null
   */
  twoFa: string | null;
}

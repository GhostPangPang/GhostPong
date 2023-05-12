import { IsNotEmpty, IsNumberString, Length } from 'class-validator';

import { CodeVerificationRequest } from '@/types/auth/request';

export class CodeVerificationRequestDto implements CodeVerificationRequest {
  /**
   * 2단계 인증 코드
   * @example '123456'
   */
  @IsNotEmpty()
  @IsNumberString()
  @Length(6, 6)
  code: string;
}

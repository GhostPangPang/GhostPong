import { IsNotEmpty, MaxLength } from 'class-validator';

export class LoginRequestDto {
  /**
   * 42에서 받아온 email
   */
  @IsNotEmpty()
  @MaxLength(320)
  email: string;

  accessToken: string;

  refreshToken: string;
}

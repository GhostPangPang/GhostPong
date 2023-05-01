import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginInfoDto {
  /**
   * 42에서 받아온 email
   */
  @IsNotEmpty()
  @IsEmail() // 320
  email: string;

  /**
   * id === null -> unregistered
   * id !== null -> registered
   */
  id: number | null;
}

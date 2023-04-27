import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginInfoDto {
  /**
   * 42에서 받아온 email
   */
  @IsNotEmpty()
  @IsEmail() // 320
  email: string;

  /**
   * isRegisterd: true -> userId: number
   * isRegisterd: false -> userId: null
   */
  id: number | null;
  // isRegistered: boolean;
}

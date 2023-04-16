import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class NicknameRequestDto {
  /**
   * 변경할 nickname
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(8)
  nickname: string;
}

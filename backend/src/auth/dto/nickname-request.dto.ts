import { IsString, MaxLength } from 'class-validator';

export class NicknameRequestDto {
  /**
   * 변경할 nickname
   */
  @IsString()
  @MaxLength(8)
  nickname: string;
}

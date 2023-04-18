import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class UpdateNicknameRequestDto {
  /**
   * nickname
   * @example 'san1'
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(8)
  @Matches(RegExp('^[가-힣a-zA-Z0-9]*$'))
  nickname: string;
}

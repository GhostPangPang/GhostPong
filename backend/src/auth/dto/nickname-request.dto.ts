import { IsString, MaxLength } from 'class-validator';

export class NicknameRequestDto {
  @IsString()
  @MaxLength(8)
  nickname: string;
}

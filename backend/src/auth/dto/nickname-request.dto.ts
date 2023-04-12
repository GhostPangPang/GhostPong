import { IsString } from 'class-validator';

export class NicknameRequestDto {
  @IsString()
  nickname: string;
}

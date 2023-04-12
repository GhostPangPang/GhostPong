import { IsString } from 'class-validator';

export class NicknameRequestDto {
  // TODO check valid nickname
  @IsString()
  nickname: string;
}
import { IsIn, IsString, Length } from 'class-validator';

import { CreateGameRequest, GameMode } from '@/types/game';

export class CreateGameRequestDto implements CreateGameRequest {
  @IsString()
  @Length(21, 21)
  gameId: string;

  @IsIn(['normal', 'speed', 'stupid'], { message: '유효하지 않은 모드입니다.' })
  mode: GameMode;
}

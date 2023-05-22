import { IsNumber, IsString, Length, Max, Min } from 'class-validator';

import { MoveBar } from '@/types/game';

import { CANVASE_HEIGHT } from '@/game/game-data';

export class MoveBarDto implements MoveBar {
  @IsString()
  @Length(21, 21)
  gameId: string;

  @IsNumber()
  @Max(CANVASE_HEIGHT)
  @Min(0)
  y: number;
}

import { IsString, Length } from 'class-validator';

import { GameStart } from '@/types/game';

export class GameStartDto implements GameStart {
  @IsString()
  @Length(21, 21)
  gameId: string;
}

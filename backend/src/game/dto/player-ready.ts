import { IsString, Length } from 'class-validator';

import { PlayerReady } from '@/types/game';

export class PlayerReadyDto implements PlayerReady {
  @IsString()
  @Length(21, 21)
  gameId: string;
}

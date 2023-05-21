import { IsString, Length } from 'class-validator';

import { CreateGameRequest } from '@/types/game';

export class CreateGameRequestDto implements CreateGameRequest {
  @IsString()
  @Length(21, 21)
  channelId: string;
}

import { Module } from '@nestjs/common';

import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

@Module({
  providers: [GameService, GameGateway],
  controllers: [GameController],
})
export class GameModule {}

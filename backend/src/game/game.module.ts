import { Module } from '@nestjs/common';

import { RepositoryModule } from '../repository/repository.module';

import { GameController } from './game.controller';
import { GameEngine } from './game.engine';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

@Module({
  imports: [RepositoryModule],
  providers: [GameService, GameGateway, GameEngine],
  controllers: [GameController],
})
export class GameModule {}

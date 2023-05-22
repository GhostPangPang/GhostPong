import { Module } from '@nestjs/common';

import { RepositoryModule } from '../repository/repository.module';

import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

@Module({
  imports: [RepositoryModule],
  providers: [GameService, GameGateway],
  controllers: [GameController],
})
export class GameModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GameHistory } from '../entity/game-history.entity';
import { UserRecord } from '../entity/user-record.entity';
import { User } from '../entity/user.entity';
import { RepositoryModule } from '../repository/repository.module';

import { GameController } from './game.controller';
import { GameEngine } from './game.engine';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

@Module({
  imports: [RepositoryModule, TypeOrmModule.forFeature([User, UserRecord, GameHistory])],
  providers: [GameService, GameGateway, GameEngine],
  controllers: [GameController],
})
export class GameModule {}

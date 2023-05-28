import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AchievementModule } from '../achievement/achievement.module';
import { GameHistory } from '../entity/game-history.entity';
import { UserRecord } from '../entity/user-record.entity';
import { User } from '../entity/user.entity';
import { RepositoryModule } from '../repository/repository.module';

import { GameEngineService } from './game-engine.service';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

@Module({
  imports: [RepositoryModule, TypeOrmModule.forFeature([User, UserRecord, GameHistory]), AchievementModule],
  providers: [GameService, GameGateway, GameEngineService],
  controllers: [GameController],
})
export class GameModule {}

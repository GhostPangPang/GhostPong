import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { AppConfigModule } from '../config/app/configuration.module';
import { Achievement } from '../entity/achievement.entity';
import { Friendship } from '../entity/friendship.entity';
import { GameHistory } from '../entity/game-history.entity';
import { UserRecord } from '../entity/user-record.entity';
import { User } from '../entity/user.entity';
import { RepositoryModule } from '../repository/repository.module';

import { UserController } from './user.controller';
import { UserGateway } from './user.gateway';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Achievement, UserRecord, GameHistory, Friendship]),
    forwardRef(() => AuthModule),
    AppConfigModule,
    RepositoryModule,
    JwtModule.register({}),
  ],
  controllers: [UserController],
  providers: [UserService, UserGateway],
  exports: [UserService],
})
export class UserModule {}

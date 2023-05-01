import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppConfigModule } from 'src/config/app/configuration.module';

import { AuthModule } from '../auth/auth.module';
import { Achievement } from '../entity/achievement.entity';
import { GameHistory } from '../entity/game-history.entity';
import { UserRecord } from '../entity/user-record.entity';
import { User } from '../entity/user.entity';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Achievement, UserRecord, GameHistory]),
    forwardRef(() => AuthModule),
    forwardRef(() => AppConfigModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

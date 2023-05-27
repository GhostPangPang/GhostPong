import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Achievement } from '../entity/achievement.entity';
import { UserRecord } from '../entity/user-record.entity';

import { AchievementService } from './achievement.service';

@Module({
  imports: [TypeOrmModule.forFeature([Achievement, UserRecord])],
  providers: [AchievementService],
  exports: [AchievementService],
})
export class AchievementModule {}

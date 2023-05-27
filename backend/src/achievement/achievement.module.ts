import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Achievement } from '../entity/achievement.entity';

import { AchievementService } from './achievement.service';

@Module({
  imports: [TypeOrmModule.forFeature([Achievement])],
  providers: [AchievementService],
  exports: [AchievementService],
})
export class AchievementModule {}

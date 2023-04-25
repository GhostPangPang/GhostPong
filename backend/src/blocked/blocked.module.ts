import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BlockedUser } from '../entity/blocked-user.entity';
import { Friendship } from '../entity/friendship.entity';
import { UserModule } from '../user/user.module';

import { BlockedController } from './blocked.controller';
import { BlockedService } from './blocked.service';

@Module({
  imports: [TypeOrmModule.forFeature([BlockedUser, Friendship]), UserModule],
  controllers: [BlockedController],
  providers: [BlockedService],
  exports: [BlockedService],
})
export class BlockedModule {}

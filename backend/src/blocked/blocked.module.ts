import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BlockedUser } from '../entity/blocked-user.entity';
import { UserModule } from '../user/user.module';

import { BlockedController } from './blocked.controller';
import { BlockedService } from './blocked.service';

@Module({
  imports: [TypeOrmModule.forFeature([BlockedUser]), UserModule],
  controllers: [BlockedController],
  providers: [BlockedService],
  exports: [BlockedService],
})
export class BlockedModule {}

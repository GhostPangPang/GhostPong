import { Module } from '@nestjs/common';

import { BlockedController } from './blocked.controller';
import { BlockedService } from './blocked.service';

@Module({
  controllers: [BlockedController],
  providers: [BlockedService],
})
export class BlockedModule {}

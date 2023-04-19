import { Test, TestingModule } from '@nestjs/testing';

import { BlockedController } from './blocked.controller';
import { BlockedService } from './blocked.service';

describe('BlockedController', () => {
  let controller: BlockedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlockedController],
      providers: [BlockedService],
    }).compile();

    controller = module.get<BlockedController>(BlockedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

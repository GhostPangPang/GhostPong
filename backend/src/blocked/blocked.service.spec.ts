import { Test, TestingModule } from '@nestjs/testing';

import { BlockedService } from './blocked.service';

describe('BlockedService', () => {
  let service: BlockedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockedService],
    }).compile();

    service = module.get<BlockedService>(BlockedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

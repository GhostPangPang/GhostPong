import { Test, TestingModule } from '@nestjs/testing';
import { FriendGateway } from './friend.gateway';

describe('FriendGateway', () => {
  let gateway: FriendGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FriendGateway],
    }).compile();

    gateway = module.get<FriendGateway>(FriendGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});

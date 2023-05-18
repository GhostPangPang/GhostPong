import { Test, TestingModule } from '@nestjs/testing';
import { ChannelGateway } from './channel.gateway';

describe('ChannelGateway', () => {
  let gateway: ChannelGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChannelGateway],
    }).compile();

    gateway = module.get<ChannelGateway>(ChannelGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});

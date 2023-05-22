import { ForbiddenException, ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import { UserStatusRepository } from '../repository/user-status.repository';
import { ChannelRepository } from '../repository/channel.repository';
import { GameRepository } from '../repository/game.repository';
import { Channel, ChannelUser } from '../repository/model/channel';
import { GameGateway } from './game.gateway';

describe('GameService', () => {
  let service: GameService;
  let gameRepository: GameRepository;
  let channelRepository: ChannelRepository;
  let userStatusRepository: UserStatusRepository;
  let gameGateway: GameGateway;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameService,
        GameRepository,
        ChannelRepository,
        UserStatusRepository,
        {
          provide: GameGateway,
          useValue: {
            broadcastGameStart: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GameService>(GameService);
    gameRepository = module.get<GameRepository>(GameRepository);
    channelRepository = module.get<ChannelRepository>(ChannelRepository);
    userStatusRepository = module.get<UserStatusRepository>(UserStatusRepository);
    gameGateway = module.get<GameGateway>(GameGateway);

    userStatusRepository.insert({ userId: 1, status: 'online' });
    userStatusRepository.insert({ userId: 2, status: 'online' });

    const mockUser: ChannelUser = {
      id: 1,
      role: 'owner',
      isPlayer: true,
      nickname: 'test',
      isMuted: false,
    };

    const mockUser2: ChannelUser = {
      id: 2,
      role: 'member',
      isPlayer: true,
      nickname: 'test2',
      isMuted: false,
    };

    const channel: Channel = new Channel('1', 'public', 'test');
    channel.users.set(1, mockUser);
    channel.users.set(2, mockUser2);
    channelRepository.insert(channel);
  });

  afterEach(() => {
    gameRepository.delete('1');
    channelRepository.update('1', { isInGame: false });
    userStatusRepository.update(1, { status: 'online' });
    userStatusRepository.update(2, { status: 'online' });
  });

  it('owner 가 게임 시작', () => {
    expect(service.createGame('1', 1)).toEqual({ message: '게임이 생성되었습니다.' });
    expect(gameRepository.find('1')).toBeDefined();
    // status update case
    expect(userStatusRepository.find(1)).toEqual({ userId: 1, status: 'game' });
    expect(userStatusRepository.find(2)).toEqual({ userId: 2, status: 'game' });
    const channel = channelRepository.find('1');
    expect(channel?.isInGame).toEqual(true);
    expect(gameGateway.broadcastGameStart).toBeCalledWith('1');
  });

  it('owner 가 아닌 유저가 게임 시작', () => {
    expect(() => service.createGame('1', 2)).toThrowError(ForbiddenException);

    expect(userStatusRepository.find(1)).toEqual({ userId: 1, status: 'online' });
    expect(userStatusRepository.find(2)).toEqual({ userId: 2, status: 'online' });
    const channel = channelRepository.find('1');
    expect(channel?.isInGame).toEqual(false);
  });

  it('플레이어가 2명 이상이 아닐 때 게임 시작', () => {
    const user = channelRepository.find('1')?.users.get(2);
    user!.isPlayer = false;
    expect(() => service.createGame('1', 1)).toThrowError(ForbiddenException);
    user!.isPlayer = true;
  });

  it('게임 중인 채널에서 게임 시작', () => {
    expect(service.createGame('1', 1)).toEqual({ message: '게임이 생성되었습니다.' });
    expect(() => service.createGame('1', 1)).toThrowError(ConflictException);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ChannelService } from './channel.service';
import { PrivateChannelRepository } from '../repository/private-channel.repository';
import { ChannelRepository } from '../repository/channel.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { CreateChannelRequestDto } from './dto/request/create-channel-request.dto';
import { Repository } from 'typeorm';
import { BadRequestException, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Channel, ChannelUser } from '../repository/model/channel';
import { before } from 'node:test';
import { PARTICIPANT_LIMIT } from '../common/constant';

describe('ChannelService', () => {
  let service: ChannelService;
  let channelRepository: ChannelRepository;
  let privateChannelRepository: PrivateChannelRepository;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChannelService,
        ChannelRepository,
        PrivateChannelRepository,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue({ id: 1, nickname: 'test', image: '/asset/profile-1.png' }),
          },
        },
      ],
    }).compile();

    service = module.get<ChannelService>(ChannelService);
    channelRepository = module.get<ChannelRepository>(ChannelRepository);
    privateChannelRepository = module.get<PrivateChannelRepository>(PrivateChannelRepository);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('createChannel', () => {
    // NOTE: success case
    it('public 채널 생성', async () => {
      const channelRequest: CreateChannelRequestDto = {
        name: 'test',
        mode: 'public',
      };

      const id = await service.createChannel(1, channelRequest);
      expect(channelRepository.count()).toBe(1);
      const channel = channelRepository.find(id);
      expect(channel).toBeDefined(); // NOT undefined

      const { name, mode, users, password, bannedUserIdList } = channel!;
      expect(name).toBe(channelRequest.name);
      expect(mode).toBe(channelRequest.mode);
      expect(users.size).toBe(1);
      expect(users.get(1)).toEqual({
        id: 1,
        nickname: 'test',
        image: '/asset/profile-1.png',
        role: 'owner',
        isMuted: false,
        isPlayer: true,
      });
      expect(password).toBeUndefined();
      expect(bannedUserIdList).toHaveLength(0);

      expect(privateChannelRepository.findAll()).toHaveLength(0);
    });

    it('private 채널 생성', async () => {
      const channelRequest: CreateChannelRequestDto = {
        name: 'test',
        mode: 'private',
      };

      const id = await service.createChannel(1, channelRequest);
      expect(privateChannelRepository.findAll()).toHaveLength(1);
      const channel = privateChannelRepository.find(id);
      expect(channel).toBeDefined(); // NOT undefined

      const { name, mode, users, password, bannedUserIdList } = channel!;
      expect(name).toBe(channelRequest.name);
      expect(mode).toBe(channelRequest.mode);
      expect(users.size).toBe(1);
      expect(users.get(1)).toEqual({
        id: 1,
        nickname: 'test',
        image: '/asset/profile-1.png',
        role: 'owner',
        isMuted: false,
        isPlayer: true,
      });
      expect(password).toBeUndefined();
      expect(bannedUserIdList).toHaveLength(0);

      expect(channelRepository.findAll()).toHaveLength(0);
    });

    it('protected 채널 생성', async () => {
      const channelRequest: CreateChannelRequestDto = {
        name: 'test',
        mode: 'protected',
        password: '1234',
      };

      const id = await service.createChannel(1, channelRequest);
      expect(channelRepository.count()).toBe(1);
      const channel = channelRepository.find(id);
      expect(channel).toBeDefined(); // NOT undefined

      const { name, mode, users, password, bannedUserIdList } = channel!;
      expect(name).toBe(channelRequest.name);
      expect(mode).toBe(channelRequest.mode);
      expect(users.size).toBe(1);
      expect(users.get(1)).toEqual({
        id: 1,
        nickname: 'test',
        image: '/asset/profile-1.png',
        role: 'owner',
        isMuted: false,
        isPlayer: true,
      });
      // password 가 설정되었는지 확인
      expect(password).toBe('1234');
      expect(bannedUserIdList).toHaveLength(0);

      expect(privateChannelRepository.findAll()).toHaveLength(0);
    });

    // NOTE: failure case
    it('유저 정보가 없는 경우', () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      expect(service.createChannel(1, { name: 'test', mode: 'public' })).rejects.toThrowError(NotFoundException);
    });

    it('다른 채널에 유저가 참여 중인 경우 (public)', () => {
      const user: ChannelUser = {
        id: 1,
        nickname: 'test',
        image: '/asset/profile-1.png',
        role: 'owner',
        isMuted: false,
        isPlayer: true,
      };
      const channel: Channel = {
        id: 'aaa',
        mode: 'public',
        name: 'test',
        users: new Map([[1, user]]),
        bannedUserIdList: [],
      };
      channelRepository.insert(channel);

      expect(service.createChannel(1, { name: 'test', mode: 'public' })).rejects.toThrowError();
    });

    it('다른 채널에 유저가 참여 중인 경우 (private)', () => {
      const user: ChannelUser = {
        id: 1,
        nickname: 'test',
        image: '/asset/profile-1.png',
        role: 'owner',
        isMuted: false,
        isPlayer: true,
      };
      const channel: Channel = {
        id: 'aaa',
        mode: 'private',
        name: 'test',
        users: new Map([[1, user]]),
        bannedUserIdList: [],
      };
      privateChannelRepository.insert(channel);

      expect(service.createChannel(1, { name: 'test', mode: 'public' })).rejects.toThrowError();
    });
  });

  describe('getChannelsList', () => {
    it('채널이 없는 경우', () => {
      expect(service.getChannelsList(0)).toEqual({ total: 0, channels: [] });
    });

    describe('채널이 20개인 경우', () => {
      beforeEach(() => {
        for (let i = 0; i < 20; ++i) {
          const channel: Channel = {
            id: `aaa${i}`,
            mode: 'public',
            name: 'test',
            users: new Map(),
            bannedUserIdList: [],
          };
          channelRepository.insert(channel);
        }
      });

      it('채널이 20개 인 경우의 cursor = 0', () => {
        const channels = service.getChannelsList(0);
        expect(channels.total).toBe(20);
        expect(channels.channels).toHaveLength(9);
        for (let i = 0; i < 9; ++i) {
          expect(channels.channels[i].id).toBe(`aaa${19 - i}`);
        }
      });

      it('채널이 20개 인 경우의 cursor = 1', () => {
        const channels = service.getChannelsList(1);
        expect(channels.total).toBeUndefined();
        expect(channels.channels).toHaveLength(9);
        for (let i = 0; i < 9; ++i) {
          expect(channels.channels[i].id).toBe(`aaa${19 - i - 9}`);
        }
      });

      it('채널이 20개 인 경우의 cursor = 2', () => {
        const channels = service.getChannelsList(2);
        expect(channels.total).toBeUndefined();
        expect(channels.channels).toHaveLength(2);
        for (let i = 0; i < 2; ++i) {
          expect(channels.channels[i].id).toBe(`aaa${19 - i - 18}`);
        }
      });

      it('채널이 20개 인 경우의 cursor = 3', () => {
        const channels = service.getChannelsList(3);
        expect(channels.total).toBeUndefined();
        expect(channels.channels).toHaveLength(0);
      });
    });
  });

  describe('joinChannel', () => {
    it('채널이 없을 경우', () => {
      expect(service.joinChannel(1, { mode: 'public' }, 'channel id')).rejects.toThrowError(NotFoundException);
    });

    it('비밀번호가 일치하지 않을 경우', async () => {
      const channel: Channel = {
        id: 'aaa',
        mode: 'protected',
        password: '1234',
        name: 'test',
        users: new Map([]),
        bannedUserIdList: [1],
      };
      const channelId = channelRepository.insert(channel);
      try {
        await service.joinChannel(1, { mode: 'protected', password: '4321' }, channelId);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toEqual('비밀번호가 일치하지 않습니다.');
      }
    });

    it('채널에 들어갈 권한 없을 경우', async () => {
      const channel: Channel = {
        id: 'aaa',
        mode: 'public',
        name: 'test',
        users: new Map([]),
        bannedUserIdList: [1],
      };
      const channelId = channelRepository.insert(channel);

      try {
        await service.joinChannel(1, { mode: 'public' }, channelId);
      } catch (e) {
        expect(e).toBeInstanceOf(ForbiddenException);
        expect(e.message).toEqual('채널에 들어갈 권한이 없습니다.');
      }
    });

    it('채널 정원 초과될 경우', async () => {
      const user: ChannelUser = {
        id: 1,
        nickname: 'test',
        image: '/asset/profile-1.png',
        role: 'owner',
        isMuted: false,
        isPlayer: true,
      };
      const channel: Channel = {
        id: 'aaa',
        mode: 'public',
        name: 'test',
        users: new Map([[1, user]]),
        bannedUserIdList: [],
      };
      for (let i = 2; i <= PARTICIPANT_LIMIT; i++) {
        channel.users.set(i, user);
      }
      const channelId = channelRepository.insert(channel);
      try {
        await service.joinChannel(11, { mode: 'public' }, channelId);
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
        expect(e.message).toEqual('채널 정원이 초과되었습니다.');
      }
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ChannelService } from './channel.service';
import { InvisibleChannelRepository } from '../repository/invisible-channel.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { CreateChannelRequestDto } from './dto/request/create-channel-request.dto';
import { Repository } from 'typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Channel, ChannelUser } from '../repository/model/channel';
import { PARTICIPANT_LIMIT } from '../common/constant';
import { VisibleChannelRepository } from '../repository/visible-channel.repository';
import { InvitationRepository } from '../repository/invitation.repository';

describe('ChannelService', () => {
  let service: ChannelService;
  let visibleChannelRepository: VisibleChannelRepository;
  let invisibleChannelRepository: InvisibleChannelRepository;
  let invitationRepository: InvitationRepository;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChannelService,
        VisibleChannelRepository,
        InvisibleChannelRepository,
        InvitationRepository,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue({ id: 1, nickname: 'test', image: '/asset/profile-1.png' }),
          },
        },
      ],
    }).compile();

    service = module.get<ChannelService>(ChannelService);
    visibleChannelRepository = module.get<VisibleChannelRepository>(VisibleChannelRepository);
    invisibleChannelRepository = module.get<InvisibleChannelRepository>(InvisibleChannelRepository);
    invitationRepository = module.get<InvitationRepository>(InvitationRepository);
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
      expect(visibleChannelRepository.count()).toBe(1);
      const channel = visibleChannelRepository.find(id);
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

      expect(invisibleChannelRepository.findAll()).toHaveLength(0);
    });

    it('private 채널 생성', async () => {
      const channelRequest: CreateChannelRequestDto = {
        name: 'test',
        mode: 'private',
      };

      const id = await service.createChannel(1, channelRequest);
      expect(invisibleChannelRepository.findAll()).toHaveLength(1);
      const channel = invisibleChannelRepository.find(id);
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

      expect(visibleChannelRepository.findAll()).toHaveLength(0);
    });

    it('protected 채널 생성', async () => {
      const channelRequest: CreateChannelRequestDto = {
        name: 'test',
        mode: 'protected',
        password: '1234',
      };

      const id = await service.createChannel(1, channelRequest);
      expect(visibleChannelRepository.count()).toBe(1);
      const channel = visibleChannelRepository.find(id);
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

      expect(invisibleChannelRepository.findAll()).toHaveLength(0);
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
        status: 'ready',
        users: new Map([[1, user]]),
        bannedUserIdList: [],
      };
      visibleChannelRepository.insert(channel);

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
        status: 'ready',
        users: new Map([[1, user]]),
        bannedUserIdList: [],
      };
      invisibleChannelRepository.insert(channel);

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
            status: 'ready',
            users: new Map(),
            bannedUserIdList: [],
          };
          visibleChannelRepository.insert(channel);
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
    it('비밀번호가 일치하지 않을 경우', async () => {
      const channel: Channel = {
        id: 'aaa',
        mode: 'protected',
        password: '1234',
        name: 'test',
        status: 'ready',
        users: new Map([]),
        bannedUserIdList: [1],
      };
      try {
        await service.joinChannel(1, { mode: 'protected', password: '4321' }, channel);
      } catch (e) {
        expect(e).toBeInstanceOf(ForbiddenException);
        expect(e.message).toEqual('비밀번호가 일치하지 않습니다.');
      }
    });

    it('private 채널에 받지 못한 경우', async () => {
      const channel: Channel = {
        id: 'aaa',
        mode: 'private',
        name: 'test',
        status: 'ready',
        users: new Map([]),
        bannedUserIdList: [],
      };

      try {
        await service.joinChannel(1, { mode: 'private' }, channel);
      } catch (e) {
        expect(e).toBeInstanceOf(ForbiddenException);
        expect(e.message).toEqual('초대가 필요한 채널입니다.');
      }
    });

    it('private 채널에 초대된 경우', async () => {
      const channel: Channel = {
        id: 'aaa',
        mode: 'private',
        name: 'test',
        status: 'ready',
        users: new Map([]),
        bannedUserIdList: [],
      };
      invitationRepository.insert({ userId: 1, channelId: 'aaa' });
      expect(await service.joinChannel(1, { mode: 'private' }, channel)).toEqual({
        message: '채널에 입장했습니다.',
      });
    });

    it('채널에 차단되어 입장 불가능한 경우', async () => {
      const channel: Channel = {
        id: 'aaa',
        mode: 'public',
        name: 'test',
        status: 'ready',
        users: new Map([]),
        bannedUserIdList: [1],
      };

      try {
        await service.joinChannel(1, { mode: 'public' }, channel);
      } catch (e) {
        expect(e).toBeInstanceOf(ForbiddenException);
        expect(e.message).toEqual('차단되어 입장이 불가능한 채널입니다.');
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
        status: 'ready',
        users: new Map([[1, user]]),
        bannedUserIdList: [],
      };
      for (let i = 2; i <= PARTICIPANT_LIMIT; i++) {
        channel.users.set(i, user);
      }
      try {
        await service.joinChannel(11, { mode: 'public' }, channel);
      } catch (e) {
        expect(e).toBeInstanceOf(ForbiddenException);
        expect(e.message).toEqual('채널 정원이 초과되었습니다.');
      }
    });

    it('게임중인 채널에 입장할 경우', async () => {
      const channel: Channel = {
        id: 'aaa',
        mode: 'public',
        name: 'test',
        status: 'playing',
        users: new Map(),
        bannedUserIdList: [],
      };
      try {
        await service.joinChannel(1, { mode: 'public' }, channel);
      } catch (e) {
        expect(e).toBeInstanceOf(ForbiddenException);
        expect(e.message).toEqual('게임이 진행중인 채널입니다.');
      }
    });
  });
});

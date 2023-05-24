import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PARTICIPANT_LIMIT } from '../common/constant';
import { Friendship } from '../entity/friendship.entity';
import { User } from '../entity/user.entity';
import {
  InvitationRepository,
  InvisibleChannelRepository,
  VisibleChannelRepository,
  SocketIdRepository,
} from '../repository';
import { Channel, ChannelUser } from '../repository/model';

import { ChannelGateway } from './channel.gateway';
import { ChannelService } from './channel.service';
import { CreateChannelRequestDto } from './dto/request/create-channel-request.dto';
import { compare } from 'bcrypt';

describe('ChannelService', () => {
  let service: ChannelService;
  let visibleChannelRepository: VisibleChannelRepository;
  let invisibleChannelRepository: InvisibleChannelRepository;
  let invitationRepository: InvitationRepository;
  let userRepository: Repository<User>;
  let socketIdRepository: SocketIdRepository;
  let channelGateway: ChannelGateway;
  let friendshipRepository: Repository<Friendship>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChannelService,
        VisibleChannelRepository,
        InvisibleChannelRepository,
        InvitationRepository,
        SocketIdRepository,
        ChannelGateway,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue({ id: 1, nickname: 'test', image: '/asset/profile-1.png' }),
          },
        },
        {
          provide: getRepositoryToken(Friendship),
          useValue: {
            findOne: jest.fn().mockResolvedValue({ id: 1, senderId: 1, receiverId: 2, accept: true }),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {},
        },
        {
          provide: ChannelGateway,
          useValue: {
            joinChannel: jest.fn(),
            emitChannel: jest.fn(),
            emitUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ChannelService>(ChannelService);
    visibleChannelRepository = module.get<VisibleChannelRepository>(VisibleChannelRepository);
    invisibleChannelRepository = module.get<InvisibleChannelRepository>(InvisibleChannelRepository);
    invitationRepository = module.get<InvitationRepository>(InvitationRepository);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    socketIdRepository = module.get<SocketIdRepository>(SocketIdRepository);
    channelGateway = module.get<ChannelGateway>(ChannelGateway);

    socketIdRepository.insert({ userId: 1, socketId: 'socketId1' });
    socketIdRepository.insert({ userId: 2, socketId: 'socketId2' });
    socketIdRepository.insert({ userId: 3, socketId: 'socketId3' });
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
      expect(await compare('1234', channelRequest.password!)).toBe(true);
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
        isInGame: false,
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
        isInGame: false,
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
            isInGame: false,
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
        isInGame: false,
        users: new Map([]),
        bannedUserIdList: [],
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
        isInGame: false,
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
        isInGame: false,
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
        isInGame: false,
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
        isInGame: false,
        users: new Map([
          [1, user],
          [2, user],
        ]),
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
  });

  describe('getChannelInfo', () => {
    it('채널에 참여하지 않은 경우', () => {
      const channel: Channel = {
        id: 'aaa',
        mode: 'public',
        name: 'test',
        isInGame: false,
        users: new Map(),
        bannedUserIdList: [],
      };
      try {
        service.getChannelInfo(1, channel);
      } catch (e) {
        expect(e).toBeInstanceOf(ForbiddenException);
        expect(e.message).toEqual('해당 채널에 참여중인 유저가 아닙니다.');
      }
    });

    it('채널 정보 조회 성공', () => {
      const player: ChannelUser = {
        id: 1,
        nickname: 'test',
        image: '/asset/profile-1.png',
        role: 'owner',
        isMuted: false,
        isPlayer: true,
      };
      const observer: ChannelUser = {
        id: 2,
        nickname: 'test',
        image: '/asset/profile-1.png',
        role: 'member',
        isMuted: false,
        isPlayer: false,
      };
      const channel: Channel = {
        id: 'aaa',
        mode: 'public',
        name: 'test',
        isInGame: false,
        users: new Map([
          [1, player],
          [2, observer],
        ]),
        bannedUserIdList: [],
      };
      expect(service.getChannelInfo(1, channel)).toEqual({
        players: [{ userId: 1, nickname: 'test', image: '/asset/profile-1.png', role: 'owner' }],
        observers: [{ userId: 2, nickname: 'test', image: '/asset/profile-1.png', role: 'member' }],
        isInGame: false,
        name: 'test',
      });
    });
  });

  describe('inviteChannel', () => {
    it('채널에 참여하지 않은 유저', async () => {
      const channel: Channel = {
        id: 'aaa',
        mode: 'public',
        name: 'test',
        isInGame: false,
        users: new Map([]),
        bannedUserIdList: [],
      };
      try {
        await service.inviteChannel(1, 3, channel);
      } catch (e) {
        expect(e).toBeInstanceOf(ForbiddenException);
        expect(e.message).toEqual('해당 채널에 참여중인 유저가 아닙니다.');
      }
    });

    it('친구가 아닌 유저를 초대한 경우', async () => {
      const player: ChannelUser = {
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
        isInGame: false,
        users: new Map([[1, player]]),
        bannedUserIdList: [],
      };
      try {
        service.inviteChannel(1, 3, channel);
      } catch (e) {
        expect(e).toBeInstanceOf(ForbiddenException);
        expect(e.message).toEqual('친구만 초대 가능합니다.');
      }
    });
  });

  describe('becomePlayer', () => {
    const player: ChannelUser = {
      id: 1,
      nickname: 'test',
      image: '/asset/profile-1.png',
      role: 'owner',
      isMuted: false,
      isPlayer: true,
    };
    it('게임이 진행중인 경우', async () => {
      const channel: Channel = {
        id: 'aaa',
        mode: 'public',
        name: 'test',
        isInGame: true,
        users: new Map([[1, player]]),
        bannedUserIdList: [],
      };
      try {
        await service.becomePlayer(1, channel);
      } catch (e) {
        expect(e).toBeInstanceOf(ForbiddenException);
        expect(e.message).toEqual('게임 진행중에 처리할 수 없습니다.');
      }
    });
    it('이미 플레이어인 경우', async () => {
      const channel: Channel = {
        id: 'aaa',
        mode: 'public',
        name: 'test',
        isInGame: false,
        users: new Map([[1, player]]),
        bannedUserIdList: [],
      };
      try {
        await service.becomePlayer(1, channel);
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
        expect(e.message).toEqual('이미 플레이어입니다.');
      }
    });
    it('플레이어 정원이 다 찬 경우', async () => {
      const user: ChannelUser = {
        id: 3,
        nickname: 'test',
        image: '/asset/profile-1.png',
        role: 'member',
        isMuted: false,
        isPlayer: false,
      };
      const channel: Channel = {
        id: 'aaa',
        mode: 'public',
        name: 'test',
        isInGame: false,
        users: new Map([[1, player]]),
        bannedUserIdList: [],
      };
      channel.users.set(2, player);
      channel.users.set(3, user);
      try {
        await service.becomePlayer(3, channel);
      } catch (e) {
        expect(e).toBeInstanceOf(ForbiddenException);
        expect(e.message).toEqual('플레이어 정원이 찼습니다.');
      }
    });
    it('성공적으로 플레이어로 참여', async () => {
      const user: ChannelUser = {
        id: 2,
        nickname: 'test',
        image: '/asset/profile-1.png',
        role: 'member',
        isMuted: false,
        isPlayer: false,
      };
      const channel: Channel = {
        id: 'aaa',
        mode: 'public',
        name: 'test',
        isInGame: false,
        users: new Map([[1, user]]),
        bannedUserIdList: [],
      };
      channel.users.set(2, user);
      expect(await service.becomePlayer(2, channel)).toEqual({
        message: '플레이어가 되었습니다.',
      });
    });
  });

  describe('assignAdminPrivileges', () => {
    const owner: ChannelUser = {
      id: 1,
      nickname: 'test',
      image: '/asset/profile-1.png',
      role: 'owner',
      isMuted: false,
      isPlayer: true,
    };

    const admin: ChannelUser = {
      id: 2,
      nickname: 'test',
      image: '/asset/profile-1.png',
      role: 'admin',
      isMuted: false,
      isPlayer: false,
    };

    const member: ChannelUser = {
      id: 3,
      nickname: 'test',
      image: '/asset/profile-1.png',
      role: 'member',
      isMuted: false,
      isPlayer: false,
    };

    const channel: Channel = {
      id: 'aaa',
      mode: 'public',
      name: 'test',
      isInGame: false,
      users: new Map([
        [1, owner],
        [2, admin],
        [3, member],
      ]),
      bannedUserIdList: [],
    };

    it('관리자 권한이 없는 경우', async () => {
      try {
        await service.assignAdminPrivileges(3, 2, channel);
      } catch (e) {
        expect(e).toBeInstanceOf(ForbiddenException);
        expect(e.message).toEqual('관리자 권한이 없습니다.');
      }
    });

    it('이미 관리자 권한을 가진 유저인 경우', async () => {
      try {
        await service.assignAdminPrivileges(1, 2, channel);
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
        expect(e.message).toEqual('이미 관리자 권한을 가진 유저입니다.');
      }
    });

    it('성공적으로 관리자 권한 부여', async () => {
      expect(await service.assignAdminPrivileges(1, 3, channel)).toEqual({
        message: '관리자 권한을 부여했습니다.',
      });
    });
  });

  describe('becomeOwner', () => {
    it('이미 방장인 경우', async () => {
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
        isInGame: false,
        users: new Map([[1, user]]),
        bannedUserIdList: [],
      };
      try {
        await service.becomeOwner(1, channel);
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
        expect(e.message).toEqual('이미 방장입니다.');
      }
    });

    it('방장이 존재하는 경우', async () => {
      const owner: ChannelUser = {
        id: 1,
        nickname: 'test',
        image: '/asset/profile-1.png',
        role: 'owner',
        isMuted: false,
        isPlayer: false,
      };
      const user: ChannelUser = {
        id: 2,
        nickname: 'test',
        image: '/asset/profile-1.png',
        role: 'member',
        isMuted: false,
        isPlayer: false,
      };
      const channel: Channel = {
        id: 'aaa',
        mode: 'public',
        name: 'test',
        isInGame: false,
        users: new Map([
          [1, owner],
          [2, user],
        ]),
        bannedUserIdList: [],
      };
      try {
        await service.becomeOwner(2, channel);
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
        expect(e.message).toEqual('방장이 존재합니다.');
      }
    });

    it('성공적으로 방장이 되는 경우', async () => {
      const user: ChannelUser = {
        id: 2,
        nickname: 'test',
        image: '/asset/profile-1.png',
        role: 'member',
        isMuted: false,
        isPlayer: false,
      };
      const channel: Channel = {
        id: 'aaa',
        mode: 'public',
        name: 'test',
        isInGame: false,
        users: new Map([[1, user]]),
        bannedUserIdList: [],
      };
      expect(await service.becomeOwner(1, channel)).toEqual({
        message: '방장이 되었습니다.',
      });
    });
  });
});

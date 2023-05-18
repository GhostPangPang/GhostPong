import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Friendship } from '../entity/friendship.entity';
import { Repository } from 'typeorm';
import { SocketIdRepository } from '../repository/socket-id.repository';
import { UserStatusRepository } from '../repository/user-status.repository';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from '../config/app/configuration.service';
import { Server, Socket } from 'socket.io';
import { ConnectionGateway } from './connection.gateway';
import { PrivateChannelRepository } from '../repository/private-channel.repository';
import { ChannelRepository } from '../repository/channel.repository';

describe('ConnectionGateway', () => {
  let gateway: ConnectionGateway;
  let server: Server;
  let socket: Socket;
  let friendshipRepository: Repository<Friendship>;
  let socketIdRepository: SocketIdRepository;
  let userStatusRepository: UserStatusRepository;
  let jwtService: JwtService;
  let appConfigService: AppConfigService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ConnectionGateway,
        {
          provide: getRepositoryToken(Friendship),
          useClass: Repository,
        },
        PrivateChannelRepository,
        ChannelRepository,
        SocketIdRepository,
        UserStatusRepository,
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn(),
          },
        },
        {
          provide: AppConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    gateway = moduleRef.get<ConnectionGateway>(ConnectionGateway);
    server = gateway.server;
    friendshipRepository = moduleRef.get<Repository<Friendship>>(getRepositoryToken(Friendship));
    socketIdRepository = moduleRef.get<SocketIdRepository>(SocketIdRepository);
    userStatusRepository = moduleRef.get<UserStatusRepository>(UserStatusRepository);
    jwtService = moduleRef.get<JwtService>(JwtService);
    appConfigService = moduleRef.get<AppConfigService>(AppConfigService);
    jest.spyOn(gateway as any, 'getUserIdFromHeader').mockImplementation(() => 1);

    socket = {
      id: 'asdf',
      data: {},
      join: jest.fn(),
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
      disconnect: jest.fn(),
    } as any;

    gateway.server = {
      sockets: {
        sockets: {
          get: jest.fn().mockReturnValue(socket),
        },
      },
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
      in: jest.fn().mockReturnThis(),
      socketsJoin: jest.fn(),
      socketsLeave: jest.fn(),
    } as any;

    jest.spyOn(gateway as any, 'findFriendList').mockImplementation(() => [
      { senderId: 1, receiverId: 2 },
      { senderId: 1, receiverId: 3 },
      { senderId: 1, receiverId: 4 },
    ]);

    socketIdRepository.insert({ userId: 2, socketId: 'asdf' });
    socketIdRepository.insert({ userId: 3, socketId: 'socket' });
    socketIdRepository.insert({ userId: 4, socketId: 'idofsocket' });

    userStatusRepository.insert({ userId: 2, status: 'online' });
    userStatusRepository.insert({ userId: 3, status: 'online' });
    userStatusRepository.insert({ userId: 4, status: 'online' });
  });

  describe('handleConnection', () => {
    it('socketIdRepository에 추가되어야 한다.', () => {
      gateway.handleConnection(socket);
      expect((socketIdRepository as any).socketIdMap.size).toBe(4);
      expect(socketIdRepository.find(1)).toEqual({ userId: 1, socketId: socket.id });
    });

    it('user status repository 에 친구가 있으면 room 에 3명이 join 되어야 한다.', () => {
      gateway.handleConnection(socket);
      expect(socket.join).toBeCalledTimes(3);
      expect(socket.join).toBeCalledWith('user-2');
      expect(socket.join).toBeCalledWith('user-3');
      expect(socket.join).toBeCalledWith('user-4');
    });
  });

  describe('handleDisconnect', () => {
    it('socketIdRepository 에서 삭제되어야 한다.', () => {
      gateway.handleConnection(socket);
      expect((socketIdRepository as any).socketIdMap.size).toBe(4);
      gateway.handleDisconnect(socket);
      expect((socketIdRepository as any).socketIdMap.size).toBe(3);
      expect(socketIdRepository.find(1)).toBeUndefined();
      userStatusRepository.insert({ userId: 1, status: 'online' });
    });
  });
});

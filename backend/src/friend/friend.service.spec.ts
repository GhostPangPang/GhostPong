import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Friendship } from '../entity/friendship.entity';
import { User } from '../entity/user.entity';

import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';

describe('FriendService', () => {
  let service: FriendService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FriendService,
        FriendController,
        {
          provide: getRepositoryToken(Friendship),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue({
              id: 1,
              sender: { id: 1 },
              receiver: { id: 2 },
              accept: false,
            }),
            findOne: jest.fn().mockResolvedValue({
              id: 1,
              sender: { id: 1 },
              receiver: { id: 2 },
              accept: false,
            }),
            count: jest.fn().mockResolvedValue(42),
            insert: jest.fn().mockResolvedValue({
              identifiers: [{ id: 1 }],
            }),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneOrFail: jest.fn().mockResolvedValue({
              id: 1,
              nickname: 'test',
            }),
          },
        },
      ],
    }).compile();

    service = module.get<FriendService>(FriendService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('test requestFriend', () => {
    it('normal request', async () => {
      // test normal request
      expect(await service.requestFriend(1, 2)).toEqual({
        id: 1,
        sender: { id: 1 },
        receiver: { id: 2 },
        accept: false,
      });
    });

    it('self friend request', async () => {
      // test throw error when senderId and receiverId are same
      await expect(service.requestFriend(1, 1)).rejects.toThrowError(ConflictException);
    });

    it('check friend count limit', async () => {
      // test throw error when friend count is over limit
      await expect(service.requestFriend(1, 2)).rejects.toThrowError(ConflictException);
    });
  });
});

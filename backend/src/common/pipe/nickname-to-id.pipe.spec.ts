import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { NicknameToIdPipe } from './nickname-to-id.pipe';
import { Repository } from 'typeorm';
import { User } from '../../entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('NicknameToUserIdPipe', () => {
  let pipe: NicknameToIdPipe;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        NicknameToIdPipe,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    pipe = moduleRef.get<NicknameToIdPipe>(NicknameToIdPipe);
    userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('transform', () => {
    const nickname = 'testuser';

    // NOTE: Success case
    it('nickname 으로 userId 를 찾아서 반환', async () => {
      const userId = 1234;
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue({ id: userId } as any);

      const result = await pipe.transform(nickname);

      expect(result).toEqual(userId);
    });

    // NOTE: Failure case
    it('nickname 이 빈 문자열일 경우 BadRequestException', async () => {
      expect(pipe.transform('')).rejects.toThrow();
    });

    it('nickname 이 undefined 일 경우 BadRequestException', async () => {
      expect(pipe.transform(undefined as unknown as string)).rejects.toThrow();
    });

    it('nickname 이 8자 초과일 경우 BadRequestException', async () => {
      expect(pipe.transform('123456789')).rejects.toThrow(BadRequestException);
    });

    it('nickname 에 허용되지 않은 문자가 들어갔을 경우 BadRequestException', async () => {
      expect(pipe.transform('testuser!')).rejects.toThrow(BadRequestException);
    });

    it('nickname 과 일치하는 유저가 없을 경우 NotFoundException', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockRejectedValueOnce(new NotFoundException());

      await expect(pipe.transform(nickname)).rejects.toThrow();
    });
  });
});

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UserService } from '../../user/user.service';
import { NicknameToIdPipe } from './nickname-to-id.pipe';

describe('NicknameToUserIdPipe', () => {
  let pipe: NicknameToIdPipe;
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        NicknameToIdPipe,
        {
          provide: UserService,
          useValue: {
            findExistUserByNickname: jest.fn().mockResolvedValue({ id: 1234 } as any),
          },
        },
      ],
    }).compile();

    pipe = moduleRef.get<NicknameToIdPipe>(NicknameToIdPipe);
    userService = moduleRef.get<UserService>(UserService);
  });

  describe('transform', () => {
    const nickname = 'testuser';

    // NOTE: Success case
    it('nickname 으로 userId 를 찾아서 반환', async () => {
      const userId = 1234;
      jest.spyOn(userService, 'findExistUserByNickname').mockResolvedValue({ id: userId } as any);

      const result = await pipe.transform(nickname);

      expect(result).toEqual(userId);
      expect(userService.findExistUserByNickname).toHaveBeenCalledWith(nickname);
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
      jest.spyOn(userService, 'findExistUserByNickname').mockRejectedValueOnce(new NotFoundException());

      await expect(pipe.transform(nickname)).rejects.toThrow();
      expect(userService.findExistUserByNickname).toHaveBeenCalledWith(nickname);
    });
  });
});

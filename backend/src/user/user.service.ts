import { ConflictException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { AuthService } from '../auth/auth.service';
import { HISTORY_SIZE_PER_PAGE } from '../common/constant';
import { SuccessResponseDto } from '../common/dto/success-response.dto';
import { AuthStatus } from '../entity/auth.entity';
import { GameHistory } from '../entity/game-history.entity';
import { User } from '../entity/user.entity';

import { UserHistoryResponseDto } from './dto/response/user-history-response.dto';
import { UserInfoResponseDto } from './dto/response/user-info-response.dto';
import { UserNicknameResponseDto } from './dto/response/user-nickname-response.dto';
import { UserProfileResponseDto } from './dto/response/user-profile-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(GameHistory)
    private readonly gameHistoryRepository: Repository<GameHistory>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  /**
   * get user's simple information
   *
   * @param myId
   * @returns
   */
  async getUserInfo(myId: number): Promise<UserInfoResponseDto> {
    const { nickname, image, exp, blockedUsers } = await this.findExistUserInfo(myId);
    return {
      id: myId,
      nickname,
      image,
      exp,
      blockedUsers: blockedUsers.map((blockedUser) => blockedUser.blockedUserId),
    };
  }

  async createUser(myId: number, nickname: string): Promise<string> {
    await this.checkAlreadyExistUser(myId); // user 이미 있으면 에러
    await this.checkDuplicatedNickname(nickname);
    await this.userRepository.manager.transaction(async (manager: EntityManager) => {
      await manager.insert('users', { id: myId, nickname: nickname });
      await manager.update('auth', { id: myId }, { status: AuthStatus.REGISTERD });
    });
    return await this.authService.signIn(myId);
  }

  async updateUserImage(myId: number, imageUrl: string): Promise<SuccessResponseDto> {
    await this.userRepository.update({ id: myId }, { image: imageUrl });
    return { message: '이미지 변경 완료되었습니다.' };
  }

  async updateUserNickname(myId: number, nickname: string): Promise<UserNicknameResponseDto> {
    await this.checkDuplicatedNickname(nickname);
    await this.userRepository.update({ id: myId }, { nickname: nickname });
    return { nickname };
  }

  async getUserProfile(userId: number): Promise<UserProfileResponseDto> {
    const { nickname, image, exp, userRecord, achievements } = await this.findExistUserProfile(userId);
    return {
      nickname,
      image,
      exp,
      winCount: userRecord.winCount,
      loseCount: userRecord.loseCount,
      achievements: achievements.map((achievement) => achievement.achievement),
    };
  }

  async getUserHistory(userId: number, cursor: number): Promise<UserHistoryResponseDto> {
    const histories: UserHistoryResponseDto = {
      histories: await this.gameHistoryRepository.find({
        relations: ['winner', 'loser'],
        where: [{ winner: { id: userId } }, { loser: { id: userId } }],
        order: { createdAt: 'DESC' },
        take: HISTORY_SIZE_PER_PAGE,
        skip: cursor * HISTORY_SIZE_PER_PAGE,
      }),
    };
    if (cursor === 0) {
      histories['total'] = await this.gameHistoryRepository.count({
        where: [{ winner: { id: userId } }, { loser: { id: userId } }],
      });
    }
    return histories;
  }

  /*
  validation method
  */

  private async checkDuplicatedNickname(nickname: string): Promise<void> {
    if (await this.userRepository.findOneBy({ nickname })) {
      throw new ConflictException('중복된 닉네임입니다.');
    }
  }

  private async checkAlreadyExistUser(userId: number): Promise<void> {
    if (await this.userRepository.findOneBy({ id: userId })) {
      throw new ConflictException('이미 존재하는 user입니다.');
    }
  }

  private async findExistUserInfo(userId: number): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.blockedUsers', 'blockedUser', 'blockedUser.userId=user.id')
      .select(['user', 'blockedUser.blockedUserId'])
      .where('user.id = :id', { id: userId })
      .getOne();
    return user!;
  }

  private async findExistUserProfile(userId: number): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.userRecord', 'userRecord', 'userRecord.id = user.id')
      .leftJoin('user.achievements', 'achievement')
      .select(['user', 'userRecord', 'achievement'])
      .where('user.id = :userId', { userId: userId })
      .getOne();
    return user!;
  }
}

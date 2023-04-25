import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { AuthService } from '../auth/auth.service';
import { SuccessResponseDto } from '../common/dto/success-response.dto';
import { User } from '../entity/user.entity';

import { NicknameResponseDto } from './dto/nickname-response.dto';
import { UserInfoResponseDto } from './dto/user-info-response.dto';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
      nickname,
      image,
      exp,
      blockedUsers: blockedUsers.map((blockedUser) => blockedUser.blockedUserId),
    };
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

  async updateUserImage(myId: number, imageUrl: string): Promise<SuccessResponseDto> {
    await this.findExistUserById(myId);
    await this.userRepository.update({ id: myId }, { image: imageUrl });
    return new SuccessResponseDto('이미지 변경 완료되었습니다.');
  }

  async updateUserNickname(myId: number, nickname: string): Promise<NicknameResponseDto> {
    await this.checkDuplicatedNickname(nickname);
    await this.userRepository.update({ id: myId }, { nickname: nickname });
    return new NicknameResponseDto(nickname);
  }

  async createUser(authId: number, nickname: string): Promise<NicknameResponseDto> {
    await this.authService.checkExistAuthId(authId); // FIXME : guard
    await this.checkAlreadyExistUser(authId);
    await this.checkDuplicatedNickname(nickname);
    await this.userRepository.manager.transaction(async (manager: EntityManager) => {
      await manager.insert(User, { id: authId, nickname: nickname });
      await this.authService.changeAuthStatus(authId);
    });
    return new NicknameResponseDto(nickname);
  }

  /*
  validation method
  */

  async findExistUserById(userId: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user === null) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }
    return user;
  }

  async findExistUserByNickname(nickname: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ nickname: nickname });
    if (user === null) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }
    return user;
  }

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
    if (user === null) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }
    return user;
  }

  private async findExistUserProfile(userId: number): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.userRecord', 'userRecord', 'userRecord.id = user.id')
      .leftJoin('user.achievements', 'achievement')
      .select(['user', 'userRecord', 'achievement'])
      .where('user.id = :userId', { userId: userId })
      .getOne();
    if (user === null) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }
    return user;
  }

  /*
  repository method
  */
}

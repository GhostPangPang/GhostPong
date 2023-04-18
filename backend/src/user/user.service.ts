import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DEFAULT_IMAGE } from '../common/constant';
import { SuccessResponseDto } from '../common/dto/success-response.dto';
import { BlockedUser } from '../entity/blocked-user.entity';
import { User } from '../entity/user.entity';

import { UserInfoResponseDto } from './dto/user-info-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(BlockedUser)
    private readonly blockedUserRepository: Repository<BlockedUser>,
  ) {}

  async getUserInfo(myId: number): Promise<UserInfoResponseDto> {
    const userInfo = await this.findExistUserById(myId);
    const numbers = await this.findBlockedByUserId(myId);
    return new UserInfoResponseDto(userInfo, numbers);
  }

  async updateProfileImage(myId: number, imageUrl: string): Promise<SuccessResponseDto> {
    await this.findExistUserById(myId);
    await this.userRepository.update({ id: myId }, { image: imageUrl });
    return new SuccessResponseDto('이미지 변경 완료되었습니다.');
  }

  async createUser(authId: number, nickname: string): Promise<void> {
    await this.checkAlreadyExist(authId);
    await this.checkDuplicatedNickname(nickname);
    await this.userRepository.insert({
      id: authId,
      nickname: nickname,
      image: DEFAULT_IMAGE,
    });
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

  async checkDuplicatedNickname(nickname: string): Promise<void> {
    // check duplicated nickname
    if (await this.userRepository.findOneBy({ nickname })) {
      throw new ConflictException('중복된 닉네임입니다.');
    }
  }

  async checkAlreadyExist(authId: number): Promise<void> {
    if (await this.userRepository.findOneBy({ id: authId })) {
      throw new ConflictException('이미 존재하는 user입니다.');
    }
  }

  /* 
  repository method
  */

  async findBlockedByUserId(userId: number): Promise<number[]> {
    return (await this.blockedUserRepository.findBy({ userId: userId })).map(
      (blockedUser) => blockedUser.blockedUserId,
    );
  }
}

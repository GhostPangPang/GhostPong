import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SuccessResponseDto } from '../common/dto/success-response.dto';
import { BlockedUser } from '../entity/blocked-user.entity';
import { User } from '../entity/user.entity';

import { MetaInfoResponseDto } from './dto/meta-info-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(BlockedUser)
    private readonly blockedUserRepository: Repository<BlockedUser>,
  ) {}

  async getUserInfo(myId: number): Promise<MetaInfoResponseDto> {
    const metaInfo = await this.findUserById(myId);
    if (metaInfo === null) {
      throw new NotFoundException('존재하지 않은 유저입니다.');
    }
    const numbers = await this.findBlockedByUserId(myId);
    return new MetaInfoResponseDto(metaInfo, numbers);
  }

  async updateProfileImage(myId: number, imageUrl: string): Promise<SuccessResponseDto> {
    await this.checkExistUser(myId);
    await this.userRepository.update({ id: myId }, { image: imageUrl });
    return new SuccessResponseDto('이미지 변경 완료되었습니다.');
  }

  /* 
    validation check
  */

  async checkExistUser(userId: number): Promise<void> {
    if ((await this.findUserById(userId)) === null) {
      throw new NotFoundException('존재하지 않은 유저입니다.');
    }
  }

  /* 
    method to access DB
  */

  async findUserById(userId: number): Promise<User | null> {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    return user;
  }

  async findBlockedByUserId(userId: number): Promise<number[]> {
    return (
      await this.blockedUserRepository.findBy({
        userId: userId,
      })
    ).map((blockedUser) => blockedUser.blockedUserId);
  }
}

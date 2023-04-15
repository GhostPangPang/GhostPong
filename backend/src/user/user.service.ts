import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

  async getUserMetaInfo(myId: number): Promise<MetaInfoResponseDto> {
    const metaInfo = await this.findUserById(myId);
    const numbers = await this.findBlockedByUserId(myId);
    return new MetaInfoResponseDto(metaInfo, numbers);
  }

  async findUserById(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) throw new NotFoundException('존재하지 않는 유저입니다.');
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

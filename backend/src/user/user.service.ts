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

  async requestMetaInfo(myId: number): Promise<MetaInfoResponseDto> {
    const metaInfo = await this.findMetaInfoById(myId);
    const numbers = await this.findBlockedByUserId(myId);
    return new MetaInfoResponseDto(metaInfo, numbers);
  }

  async findMetaInfoById(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) throw new NotFoundException('존재하지 않는 유저입니다.');
    return user;
  }

  async findBlockedByUserId(userId: number): Promise<number[]> {
    const blockedList = await this.blockedUserRepository
      .createQueryBuilder('blockedUser')
      .select('blockedUser')
      .where('blockedUser.userId = :id', { id: userId })
      .getMany();
    const numbers: number[] = [];
    if (blockedList) {
      blockedList.forEach((BlockedUser) => numbers.push(BlockedUser.blockedUserId));
    }
    return numbers;
  }
}

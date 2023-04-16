import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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

  async getUserMetaInfo(myId: number): Promise<MetaInfoResponseDto> {
    const metaInfo = await this.findUserById(myId);
    const numbers = await this.findBlockedByUserId(myId);
    return new MetaInfoResponseDto(metaInfo, numbers);
  }

  async updateProfileImage(myId: number, imageUrl: string): Promise<SuccessResponseDto> {
    await this.updateProfileImageById(myId, imageUrl);
    return new SuccessResponseDto('이미지 변경 완료되었습니다.');
  }

  /* 
    method to access DB
  */

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

  async updateProfileImageById(myId: number, imageUrl: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: myId },
    });
    if (!user) throw new NotFoundException('존재하지 않는 유저입니다. ');

    try {
      await this.userRepository.update({ id: myId }, { image: imageUrl });
    } catch (error) {
      throw new ConflictException('이미지 업로드에 실패하였습니다.');
    }
  }
}

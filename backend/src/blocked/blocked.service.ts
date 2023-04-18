import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BLOCKED_USER_LIMIT } from '../common/constant';
import { SuccessResponseDto } from '../common/dto/success-response.dto';
import { BlockedUser } from '../entity/blocked-user.entity';
import { Friendship } from '../entity/friendship.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class BlockedService {
  constructor(
    @InjectRepository(BlockedUser)
    private readonly blockedUserRepository: Repository<BlockedUser>,
    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>,
    private readonly userService: UserService,
  ) {}

  async blockUserById(myId: number, userId: number): Promise<SuccessResponseDto> {
    await this.userService.findExistUserById(userId);
    return this.blockUser(myId, userId);
  }

  async blockUserByNickname(myId: number, nickname: string): Promise<SuccessResponseDto> {
    const user = await this.userService.findExistUserByNickname(nickname);
    return this.blockUser(myId, user.id);
  }

  async blockUser(myId: number, userId: number): Promise<SuccessResponseDto> {
    if (myId === userId) {
      throw new ConflictException('스스로를 미워하지 마십시오.');
    }
    await this.checkBlockedCountLimit(myId);
    await this.checkExistBlockedUser(myId, userId);
    const friendship = await this.checkIsFriend(myId, userId);
    if (friendship !== null) {
      await this.friendshipRepository.delete(friendship);
    }
    await this.blockedUserRepository.insert({ userId: myId, blockedUserId: userId });
    return new SuccessResponseDto('유저를 차단하였습니다.');
  }

  /* 
  TODO: friend 도메인으로 옮기면 좋을 것 같은 메서드들 
  */
  async checkIsFriend(myId: number, userId: number): Promise<Friendship | null> {
    const friendship = await this.friendshipRepository.findOneBy([
      {
        sender: { id: myId },
        receiver: { id: userId },
        accept: true,
      },
      {
        sender: { id: userId },
        receiver: { id: myId },
        accept: true,
      },
    ]);
    if (friendship !== null) {
      return friendship;
    }
    return null;
  }

  /* 
  validation check method
  */

  async checkBlockedCountLimit(userId: number): Promise<void> {
    const count = await this.blockedUserRepository.countBy({ userId: userId });
    if (count >= BLOCKED_USER_LIMIT) {
      throw new ForbiddenException('차단 목록 정원이 찼습니다.');
    }
  }

  async checkExistBlockedUser(userId: number, blockedUserId: number): Promise<void> {
    const record = await this.blockedUserRepository.findOneBy({
      userId: userId,
      blockedUserId: blockedUserId,
    });
    if (record !== null) {
      throw new NotFoundException('이미 차단한 유저입니다.');
    }
  }

  /* 
  repository method
  */
}

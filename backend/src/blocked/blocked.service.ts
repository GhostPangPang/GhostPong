import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BLOCKED_USER_LIMIT } from '../common/constant';
import { SuccessResponseDto } from '../common/dto/success-response.dto';
import { BlockedUser } from '../entity/blocked-user.entity';
import { Friendship } from '../entity/friendship.entity';

import { BlockedUserResponseDto } from './dto/response/blocked-user-response.dto';

@Injectable()
export class BlockedService {
  constructor(
    @InjectRepository(BlockedUser)
    private readonly blockedUserRepository: Repository<BlockedUser>,
  ) {}

  async blockUser(myId: number, userId: number): Promise<SuccessResponseDto> {
    if (myId === userId) {
      throw new BadRequestException('스스로를 미워하지 마십시오.');
    }
    if ((await this.findBlockedUser(myId, userId)) !== null) {
      throw new ConflictException('이미 차단한 유저입니다.');
    }
    await this.checkBlockedCountLimit(myId);
    await this.blockUserAndDeleteFriendships(myId, userId);
    return { message: '유저를 차단하였습니다.' };
  }

  async deleteBlockedUser(myId: number, userId: number): Promise<SuccessResponseDto> {
    if (myId === userId) {
      throw new BadRequestException('본인 자신은 차단되어 있지 않습니다!!!');
    }
    const blockedUser = await this.blockedUserRepository.findOneBy({ userId: myId, blockedUserId: userId });
    if (blockedUser === null) {
      throw new NotFoundException('차단 기록이 없습니다.');
    }
    await this.blockedUserRepository.delete({ userId: blockedUser.userId, blockedUserId: blockedUser.blockedUserId });
    return { message: '차단 해제 되었습니다.' };
  }

  async getBlockedUserList(myId: number): Promise<BlockedUserResponseDto> {
    return {
      blocked: (await this.blockedUserRepository.find({ relations: ['blockedUser'], where: { userId: myId } })).map(
        (blockedUser) => blockedUser.blockedUser,
      ),
    };
  }

  /**
   * 차단 기록이 없는지 확인.
   *
   * @param userId 나의 id
   * @param blockedUserId 차단당할 유저의 id
   */
  private async findBlockedUser(userId: number, blockedUserId: number): Promise<BlockedUser | null> {
    return this.blockedUserRepository.findOneBy({ userId: userId, blockedUserId: blockedUserId });
  }

  /*
  validation check method
  */

  private async checkBlockedCountLimit(userId: number): Promise<void> {
    const count = await this.blockedUserRepository.countBy({ userId: userId });
    if (count >= BLOCKED_USER_LIMIT) {
      throw new ForbiddenException('차단 목록 정원이 찼습니다.');
    }
  }

  /**
   * 유저를 차단하고 친구 및 친구 신청 관계를 모두 삭제한다.
   *
   * @param userId 차단할 사람의 id (나)
   * @param blockedUserId 차단당할 사람의 id (상대방)
   */
  private async blockUserAndDeleteFriendships(userId: number, blockedUserId: number): Promise<void> {
    this.blockedUserRepository.manager.transaction(async (manager) => {
      await manager
        .createQueryBuilder(Friendship, 'friendship')
        .delete()
        .where('friendship.receiver_id = :userId AND friendship.sender_id = :blockedUserId', { userId, blockedUserId })
        .orWhere('friendship.sender_id = :userId AND friendship.receiver_id= :blockedUserId', { userId, blockedUserId })
        .execute();
      await manager.insert('blocked_user', { userId: userId, blockedUserId: blockedUserId });
    });
  }
}

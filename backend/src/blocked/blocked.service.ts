import {
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    @Inject(forwardRef(() => UserService))
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

  async deleteBlockedUser(myId: number, userId: number): Promise<SuccessResponseDto> {
    if (myId === userId) {
      throw new ConflictException('본인 자신은 차단되어 있지 않습니다!!!');
    }
    await this.userService.findExistUserById(userId);
    const blockedUser = await this.blockedUserRepository.findOneBy({ userId: myId, blockedUserId: userId });
    if (blockedUser === null) {
      throw new NotFoundException('차단한 적이 없는 유저입니다.');
    }
    await this.blockedUserRepository.delete(blockedUser);
    return new SuccessResponseDto('차단 해제 되었습니다.');
  }

  /* 
    TODO: friend 도메인으로 옮기면 좋을 것 같은 메서드들 
  */

  async checkIsFriend(myId: number, userId: number): Promise<Friendship | null> {
    const friendship = await this.friendshipRepository.findOneBy([
      { sender: { id: myId }, receiver: { id: userId }, accept: true },
      { sender: { id: userId }, receiver: { id: myId }, accept: true },
    ]);
    return friendship;
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

  private async checkExistBlockedUser(userId: number, blockedUserId: number): Promise<void> {
    const record = await this.blockedUserRepository.findOneBy({ userId: userId, blockedUserId: blockedUserId });
    if (record !== null) {
      throw new NotFoundException('이미 차단한 유저입니다.');
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

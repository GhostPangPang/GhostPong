import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FRIEND_LIMIT } from '../common/constant';
import { SuccessResponseDto } from '../common/dto/success-response.dto';
import { BlockedUser } from '../entity/blocked-user.entity';
import { Friendship } from '../entity/friendship.entity';

import { FriendsResponseDto } from './dto/response/friend-response.dto';
import { RequestedFriendsResponseDto } from './dto/response/requested-friend-response.dto';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>,
    @InjectRepository(BlockedUser)
    private readonly blockedUserRepository: Repository<BlockedUser>,
  ) {}

  // SECTION: public
  /**
   * 친구 목록을 가져온다.
   *
   * @param userId 친구 목록을 가져올 유저의 id (내 id)
   * @returns 친구 목록
   */
  async getFriendsList(userId: number): Promise<FriendsResponseDto> {
    return {
      friends: (
        await this.friendshipRepository.find({
          relations: ['sender', 'receiver', 'messageView'],
          where: [
            { senderId: userId, accept: true },
            { receiverId: userId, accept: true },
          ],
          order: { lastMessageTime: 'DESC' },
        })
      ).map(({ id, sender, receiver, lastMessageTime, messageView }) => {
        // messgeView 가 없으면 (find() 가 undefined 이면) null
        const lastViewTime = messageView.find((view) => view.user.id === userId)?.lastViewTime || null;
        return {
          id,
          user: sender.id === userId ? receiver : sender,
          lastMessageTime,
          lastViewTime,
        };
      }),
    };
  }

  /**
   * 친구 신청을 보낸다.
   *
   * @param senderId 보내는 유저 (나)
   * @param receiverId 신청 받는 유저 (상대방)
   * @returns
   */
  async requestFriend(senderId: number, receiverId: number): Promise<SuccessResponseDto> {
    if (senderId === receiverId) {
      throw new BadRequestException('당신은 이미 당신의 소중한 친구입니다. ^_^');
    }
    const blockedUser = await this.blockedUserRepository.findOneBy([
      { userId: senderId, blockedUserId: receiverId },
      { userId: receiverId, blockedUserId: senderId },
    ]);
    if (blockedUser !== null) {
      throw new ForbiddenException(
        blockedUser.blockedUserId === senderId ? '당신을 차단한 유저입니다.' : '당신이 차단한 유저입니다.',
      );
    }

    // 친구 신청 혹은 친구 관계가 있는 지 확인. 하나라도 있으면 error 이므로 findOneBy.
    const friendship = await this.friendshipRepository.findOneBy([
      { senderId: senderId, receiverId: receiverId }, // sender -> receiver
      { senderId: receiverId, receiverId: senderId }, // receiver -> sender
    ]);
    if (friendship !== null) {
      throw new ConflictException(
        friendship.accept
          ? '이미 친구인 유저입니다.'
          : friendship.senderId === senderId
          ? '이미 친구 신청을 보낸 유저입니다.'
          : '이미 친구 신청을 받은 유저입니다.',
      );
    }
    await this.checkFriendLimit(senderId, '나');
    await this.checkFriendLimit(receiverId, '상대방');
    await this.checkFriendRequestLimit(receiverId);

    await this.friendshipRepository.insert({ senderId, receiverId });
    return { message: '친구 신청을 보냈습니다.' };
  }

  /**
   * 친구 신청받은 목록을 가져온다.
   *
   * @param userId
   * @returns
   */
  async getFriendRequestsList(userId: number): Promise<RequestedFriendsResponseDto> {
    return {
      requests: await this.friendshipRepository.find({
        select: ['id', 'sender'],
        relations: ['sender'],
        where: { receiverId: userId, accept: false },
      }),
    };
  }

  /**
   * 친구 관계 삭제
   *
   * @param senderId
   * @param receiverId
   * @returns
   */
  async deleteFriend(friendId: number, myId: number): Promise<SuccessResponseDto> {
    const { senderId, receiverId } = await this.findExistFriendship(friendId, true);
    if (senderId !== myId && receiverId !== myId) {
      throw new ForbiddenException('친구 관계를 삭제할 수 있는 권한이 없습니다.');
    }
    await this.friendshipRepository.delete(friendId);
    return { message: '친구를 삭제했습니다.' };
  }

  /**
   * 친구 신청 수락
   *
   * @param friendId 받은 친구 신청의 id
   * @param myId 신청을 받은 유저 : 나
   * @returns
   */
  async acceptFriendRequest(friendId: number, myId: number): Promise<SuccessResponseDto> {
    const { senderId, receiverId } = await this.findExistFriendship(friendId, false);
    if (receiverId !== myId) {
      throw new ForbiddenException('친구 신청을 받은 유저만 수락할 수 있습니다.');
    }
    await this.checkFriendLimit(receiverId, '나');
    await this.checkFriendLimit(senderId, '상대방');
    await this.friendshipRepository.update({ id: friendId }, { accept: true });
    return { message: '친구 추가 되었습니다.' };
  }

  /**
   * 친구 신청 거절
   *
   * @param friendId 받은 친구 신청의 id
   * @param myId 신청을 받은 유저 : 나
   * @returns
   */
  async rejectFriendRequest(friendId: number, myId: number): Promise<SuccessResponseDto> {
    const { receiverId } = await this.findExistFriendship(friendId, false);
    if (receiverId !== myId) {
      throw new ForbiddenException('친구 신청을 받은 유저만 거절할 수 있습니다.');
    }
    await this.friendshipRepository.delete(friendId);
    return { message: '친구 신청을 거절했습니다.' };
  }
  // !SECTION public

  // SECTION: private
  /**
   * 친구 정원이 꽉 찼는지 확인한다.
   *
   * @param userId 친구 수를 체크할 유저
   * @param userType 유저의 타입 ( 나 or 상대방 )
   */
  private async checkFriendLimit(userId: number, userType: string): Promise<void> {
    if (
      (await this.friendshipRepository.countBy([
        { receiverId: userId, accept: true },
        { senderId: userId, accept: true },
      ])) >= FRIEND_LIMIT
    ) {
      throw new ForbiddenException(`${userType}의 친구 정원이 꽉 찼습니다.`);
    }
  }

  /**
   * 친구 신청 정원이 꽉 찼는지 확인한다.
   *
   * @param userId 친구 신청 수를 체크할 유저
   */
  private async checkFriendRequestLimit(userId: number): Promise<void> {
    if ((await this.friendshipRepository.countBy({ receiver: { id: userId }, accept: false })) >= FRIEND_LIMIT) {
      throw new ForbiddenException('친구 신청 정원이 꽉 찬 유저입니다.');
    }
  }

  /**
   * friendId 로 유효한 친구관계를 찾아서 반환.
   *
   * @param friendId 찾을 친구관계의 id
   * @param accept true 이면 친구, false 이면 친구 신청.
   * @returns
   */
  private async findExistFriendship(friendId: number, accept?: boolean): Promise<Friendship> {
    const friendship = await this.friendshipRepository.findOneBy({ id: friendId, accept });
    if (friendship === null) {
      throw new NotFoundException('친구 관계가 존재하지 않습니다.');
    }
    return friendship;
  }

  // !SECTION private
}

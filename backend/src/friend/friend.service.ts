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
import { Friendship } from '../entity/friendship.entity';
import { User } from '../entity/user.entity';
import { UserService } from '../user/user.service';

import { FriendsResponseDto } from './dto/friend-response.dto';
import { RequestedFriendsResponseDto } from './dto/requested-friend-response.dto';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>,
    @InjectRepository(User)
    private readonly userService: UserService,
  ) {}

  // SECTION: private
  /**
   *
   * @param userId 친구 수를 체크할 유저
   * @param userType 유저의 타입 ( 나 or 상대방 )
   */
  private async checkFriendLimit(userId: number, userType: string): Promise<void> {
    if (
      (await this.friendshipRepository.countBy([
        { receiver: { id: userId }, accept: true },
        { sender: { id: userId }, accept: true },
      ])) >= FRIEND_LIMIT
    ) {
      throw new ForbiddenException(`${userType}의 친구 정원이 꽉 찼습니다.`);
    }
  }

  private async checkFriendRequestLimit(userId: number): Promise<void> {
    if ((await this.friendshipRepository.countBy({ receiver: { id: userId }, accept: false })) >= FRIEND_LIMIT) {
      throw new ForbiddenException('친구 신청 정원이 꽉 찬 유저입니다.');
    }
  }

  private async getFriendship(senderId: number, receiverId: number): Promise<Friendship> {
    const friendship = await this.friendshipRepository.findOneBy({
      sender: { id: senderId },
      receiver: { id: receiverId },
    });
    if (friendship === null) {
      throw new NotFoundException('존재하지 않는 친구 신청입니다.');
    }
    if (friendship.accept === true) {
      throw new ConflictException('이미 친구인 유저입니다.');
    }
    return friendship;
  }

  // !SECTION private

  // SECTION: public
  async getFriendsList(userId: number): Promise<FriendsResponseDto> {
    return {
      friends: (
        await this.friendshipRepository.find({
          relations: ['sender', 'receiver', 'messageView'],
          where: [
            { sender: { id: userId }, accept: true },
            { receiver: { id: userId }, accept: true },
          ],
          order: { lastMessegeTime: 'DESC' },
        })
      ).map(({ sender, receiver, lastMessegeTime, messageView }) => {
        // messgeView 가 없으면 (find() 가 undefined 이면) null
        const lastViewTime = messageView.find((view) => view.user.id === userId)?.lastViewTime || null;
        return {
          ...(sender.id === userId ? receiver : sender),
          lastMessegeTime,
          lastViewTime,
        };
      }),
    };
  }

  async requestFriendByNickname(senderId: number, nickname: string): Promise<SuccessResponseDto> {
    return this.requestFriendById(senderId, (await this.userService.findExistUserByNickname(nickname)).id);
  }

  /**
   *
   * @param senderId 신청 보내는 유저 : 나
   * @param receiverId 신청 받는 유저 : 상대방
   * @returns
   */
  async requestFriendById(senderId: number, receiverId: number): Promise<SuccessResponseDto> {
    // FIXME : pipe 로 로직 바꾸기
    if (senderId === receiverId) {
      throw new BadRequestException('당신은 이미 당신의 소중한 친구입니다. ^_^');
    }
    // check receiver exists
    await this.userService.findExistUserById(receiverId);
    const friendship = await this.friendshipRepository.findOneBy([
      { sender: { id: senderId }, receiver: { id: receiverId } }, // sender -> receiver
      { sender: { id: receiverId }, receiver: { id: senderId } }, // receiver -> sender
    ]);
    if (friendship !== null) {
      throw new ConflictException(
        friendship.accept ? '이미 친구인 유저입니다.' : '이미 친구 신청을 보냈거나 받은 유저입니다.',
      );
    }
    await this.checkFriendLimit(receiverId, '상대방');
    await this.checkFriendRequestLimit(receiverId);

    await this.friendshipRepository.insert({
      sender: { id: senderId },
      receiver: { id: receiverId },
    });
    return new SuccessResponseDto('친구 신청을 보냈습니다.');
  }

  async getFriendRequestsList(userId: number): Promise<RequestedFriendsResponseDto> {
    return {
      requests: (
        await this.friendshipRepository.find({
          relations: ['sender'],
          where: { receiver: { id: userId }, accept: false },
        })
      ).map((friendship) => friendship.sender),
    };
  }

  /**
   *
   * @param senderId 신청을 보내놓은 유저 : 상대방
   * @param receiverId 신청을 받은 유저 : 나
   * @returns
   */
  async acceptFriendRequest(senderId: number, receiverId: number): Promise<SuccessResponseDto> {
    // FIXME : pipe 로 로직 바꾸기
    if (senderId === receiverId) {
      throw new BadRequestException('당신은 이미 당신의 소중한 친구입니다. ^_^');
    }

    const friendship = await this.getFriendship(senderId, receiverId);
    await this.checkFriendLimit(receiverId, '나'); // 내 친구 42명 넘음
    await this.checkFriendLimit(senderId, '상대방'); //상대의 친구 42명 넘음
    await this.friendshipRepository.update({ id: friendship.id }, { accept: true });
    return new SuccessResponseDto('친구 추가 되었습니다.');
  }

  /**
   *
   * @param senderId 신청을 보내놓은 유저 : 상대방
   * @param receiverId 신청을 받은 유저 : 나
   * @returns
   */
  async rejectFriendRequest(senderId: number, receiverId: number): Promise<SuccessResponseDto> {
    // FIXME : pipe 로 로직 바꾸기
    if (senderId === receiverId) {
      throw new BadRequestException('스스로를 거부하지 마십시오...');
    }
    await this.friendshipRepository.delete({ id: (await this.getFriendship(senderId, receiverId)).id });
    return new SuccessResponseDto('친구 신청을 거절했습니다.');
  }
  // !SECTION public
}

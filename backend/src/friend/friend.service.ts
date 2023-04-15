import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';

import { FRIEND_LIMIT } from '../common/constant';
import { SuccessResponseDto } from '../common/dto/success-response.dto';
import { Friendship } from '../entity/friendship.entity';
import { User } from '../entity/user.entity';

import { RequestedFriendResponseDto } from './dto/requested-friend-response.dto';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private async countFriend(userId: number): Promise<number> {
    return this.friendshipRepository.count({
      where: {
        receiver: { id: userId },
        accept: true,
      },
    });
  }

  private async countFriendRequest(userId: number): Promise<number> {
    return this.friendshipRepository.count({
      where: {
        receiver: { id: userId },
        accept: false,
      },
    });
  }

  private findFriendshipByUsers(senderId: number, receiverId: number): Promise<Friendship | null> {
    return this.friendshipRepository.findOneBy({
      sender: { id: senderId },
      receiver: { id: receiverId },
    });
  }

  private async findUserIdByNickname(nickname: string): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail({
        select: ['id'],
        where: { nickname: nickname },
      });
    } catch (error) {
      throw error instanceof EntityNotFoundError ? new NotFoundException('존재하지 않는 유저입니다.') : error;
    }
  }

  async requestFriendByNickname(senderId: number, nickname: string): Promise<SuccessResponseDto> {
    return this.requestFriendById(senderId, (await this.findUserIdByNickname(nickname)).id);
  }

  async requestFriendById(senderId: number, receiverId: number): Promise<SuccessResponseDto> {
    if (senderId === receiverId) throw new BadRequestException('당신은 이미 당신의 소중한 친구입니다. ^_^');

    const friendship = await this.findFriendshipByUsers(senderId, receiverId);
    if (friendship !== null) {
      if (friendship.accept) {
        throw new ConflictException('이미 친구인 유저입니다.');
      }
      throw new ConflictException('이미 친구 신청을 보낸 유저입니다.');
    }
    if ((await this.countFriend(receiverId)) >= FRIEND_LIMIT)
      throw new ForbiddenException('친구 정원이 꽉 찬 유저입니다.');
    if ((await this.countFriendRequest(senderId)) >= FRIEND_LIMIT)
      throw new ForbiddenException('친구 신청 정원이 꽉 찬 유저입니다.');

    await this.friendshipRepository.insert({
      sender: { id: senderId },
      receiver: { id: receiverId },
    });
    return new SuccessResponseDto('친구 신청을 보냈습니다.');
  }

  async getFriendRequestList(userId: number): Promise<RequestedFriendResponseDto> {
    return {
      requests: (
        await this.friendshipRepository.find({
          relations: ['sender'],
          where: { receiver: { id: userId }, accept: false },
        })
      ).map((friendship) => friendship.sender),
    };
  }

  async acceptFriendRequest(senderId: number, receiverId: number): Promise<SuccessResponseDto> {
    if (senderId === receiverId) throw new BadRequestException('당신은 이미 당신의 소중한 친구입니다. ^_^');
    const friendship = await this.findFriendshipByUsers(senderId, receiverId);
    if (friendship === null) throw new NotFoundException('존재하지 않는 친구 신청입니다.');
    if (friendship.accept === true) throw new ConflictException('이미 친구인 유저입니다.');
    if ((await this.countFriend(senderId)) >= FRIEND_LIMIT)
      throw new ForbiddenException('친구 정원이 꽉 찬 유저입니다.');

    await this.friendshipRepository.update(
      { id: friendship.id },
      {
        accept: true,
      },
    );
    return new SuccessResponseDto('친구 추가 되었습니다.');
  }

  async rejectFriendRequest(senderId: number, receiverId: number): Promise<SuccessResponseDto> {
    if (senderId === receiverId) throw new BadRequestException('스스로를 거부하지 마십시오...');
    const friendship = await this.findFriendshipByUsers(senderId, receiverId);
    if (friendship === null) throw new NotFoundException('존재하지 않는 친구 신청입니다.');
    if (friendship.accept === true) throw new ConflictException('이미 친구인 유저입니다.');

    await this.friendshipRepository.delete({ id: friendship.id });
    return new SuccessResponseDto('친구 신청을 거절했습니다.');
  }
}

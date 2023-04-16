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

  private async checkFriendLimit(userId: number): Promise<void> {
    if ((await this.friendshipRepository.countBy({ receiver: { id: userId }, accept: true })) >= FRIEND_LIMIT) {
      throw new ForbiddenException('친구 정원이 꽉 찬 유저입니다.');
    }
  }

  private async checkFriendRequestLimit(userId: number): Promise<void> {
    if ((await this.friendshipRepository.countBy({ receiver: { id: userId }, accept: false })) >= FRIEND_LIMIT) {
      throw new ForbiddenException('친구 신청 정원이 꽉 찬 유저입니다.');
    }
  }

  async requestFriendByNickname(senderId: number, nickname: string): Promise<SuccessResponseDto> {
    try {
      return this.requestFriendById(
        senderId,
        (await this.userRepository.findOneOrFail({ select: ['id'], where: { nickname: nickname } })).id,
      );
    } catch (error) {
      throw error instanceof EntityNotFoundError ? new NotFoundException('존재하지 않는 유저입니다.') : error;
    }
  }

  async requestFriendById(senderId: number, receiverId: number): Promise<SuccessResponseDto> {
    if (senderId === receiverId) throw new BadRequestException('당신은 이미 당신의 소중한 친구입니다. ^_^');

    const friendship = await this.friendshipRepository.findOneBy({
      sender: { id: senderId },
      receiver: { id: receiverId },
    });
    if (friendship !== null) {
      throw new ConflictException(friendship.accept ? '이미 친구인 유저입니다.' : '이미 친구 신청을 보낸 유저입니다.');
    }
    await this.checkFriendLimit(receiverId);
    await this.checkFriendRequestLimit(receiverId);

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
    // FIXME : pipe 로 로직 바꾸기
    if (senderId === receiverId) {
      throw new BadRequestException('당신은 이미 당신의 소중한 친구입니다. ^_^');
    }

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
    await this.checkFriendLimit(receiverId);
    await this.friendshipRepository.update(
      { id: friendship.id },
      {
        accept: true,
      },
    );
    return new SuccessResponseDto('친구 추가 되었습니다.');
  }

  async rejectFriendRequest(senderId: number, receiverId: number): Promise<SuccessResponseDto> {
    // FIXME : pipe 로 로직 바꾸기
    if (senderId === receiverId) {
      throw new BadRequestException('스스로를 거부하지 마십시오...');
    }

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
    await this.friendshipRepository.delete({ id: friendship.id });
    return new SuccessResponseDto('친구 신청을 거절했습니다.');
  }
}

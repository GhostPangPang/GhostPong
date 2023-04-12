import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';

import { FRIEND_LIMIT } from '../common/constant';
import { SuccessResponseDto } from '../common/dto/sucess-response.dto';
import { Friendship } from '../entity/friendship.entity';
import { User } from '../entity/user.entity';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async checkFriendCountLimit(userID: number): Promise<void> {
    const count = await this.friendshipRepository.count({
      where: {
        sender: { id: userID },
        accept: true,
      },
    });
    if (count >= FRIEND_LIMIT) throw new ConflictException('친구 신청 정원이 꽉 찬 유저입니다.');
  }

  async checkExistsFriendship(senderId: number, receiverId: number): Promise<void> {
    const count = await this.friendshipRepository.count({
      where: {
        sender: { id: senderId },
        receiver: { id: receiverId },
      },
    });
    if (count !== 0) throw new ConflictException('이미 친구 신청을 보냈거나 친구인 유저입니다.');
  }

  async findUserNicknameById(id: number): Promise<string> {
    // FIXME: Replace with UserService.
    try {
      return (
        await this.userRepository.findOneOrFail({
          select: ['nickname'],
          where: { id: id },
        })
      ).nickname;
    } catch (error) {
      throw error instanceof EntityNotFoundError ? new NotFoundException('존재하지 않는 유저입니다.') : error;
    }
  }

  async findUserIdByNickname(nickname: string): Promise<number> {
    // FIXME: Replace with UserService.
    try {
      return (
        await this.userRepository.findOneOrFail({
          select: ['id'],
          where: { nickname: nickname },
        })
      ).id;
    } catch (error) {
      throw error instanceof EntityNotFoundError ? new NotFoundException('존재하지 않는 유저입니다.') : error;
    }
  }

  async requestFriendByNickname(senderId: number, nickname: string): Promise<SuccessResponseDto> {
    const receiverId = await this.findUserIdByNickname(nickname);
    await this.requestFriend(senderId, receiverId);
    return new SuccessResponseDto(`${nickname} 에게 친구 신청을 보냈습니다.`);
  }

  async requestFriendById(senderId: number, receiverId: number): Promise<SuccessResponseDto> {
    await this.requestFriend(senderId, receiverId);
    return new SuccessResponseDto(`${await this.findUserNicknameById(receiverId)} 에게 친구 신청을 보냈습니다.`);
  }

  /**
   * id 로 FreindShip row 를 만든다.
   * @param id 친구 신청할 유저의 id
   */
  async requestFriend(senderId: number, receiverId: number): Promise<void> {
    if (senderId === receiverId) throw new ConflictException('당신은 이미 당신의 소중한 친구입니다. ^_^');

    await this.checkExistsFriendship(senderId, receiverId);
    await this.checkFriendCountLimit(receiverId);
    await this.friendshipRepository.insert({
      sender: { id: senderId },
      receiver: { id: receiverId },
    });
  }
}

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';

import { MESSAGE_SIZE_PER_PAGE } from '../common/constant';
import { Friendship } from '../entity/friendship.entity';
import { Message } from '../entity/message.entity';

import { MessageResponseDto } from './dto/response/message-response.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>,
  ) {}

  /**
   * 메시지 리스트 가져오메
   *
   * @param myId 내 아이디
   * @param friendId 친구와의 friendship의 id
   * @param offset 마지막으로 가져온 메시지의 id
   */
  async getMessagesList(myId: number, friendId: number, offset: number): Promise<MessageResponseDto> {
    const friendship = await this.friendshipRepository.findOneBy([{ id: friendId, accept: true }]);
    if (friendship === null) {
      throw new NotFoundException('친구 관계가 없습니다.');
    }
    if (friendship.sender.id !== myId && friendship.receiver.id !== myId) {
      throw new ForbiddenException('친구 관계에 속한 유저가 아닙니다.');
    }
    return {
      messages: await this.messageRepository.find({
        select: ['id', 'senderId', 'content', 'createdAt'],
        where: { friendId, id: isNaN(offset) ? undefined : LessThan(offset) },
        order: { createdAt: 'DESC' },
        take: MESSAGE_SIZE_PER_PAGE, // max limit of entities that should be taken
      }),
    };
  }
}

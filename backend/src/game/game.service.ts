import { ForbiddenException, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { nanoid } from 'nanoid';
import { Repository } from 'typeorm';

import { MemberInfo } from '@/types/channel';
import { GameMode } from '@/types/game';

import { SuccessResponseDto } from '../common/dto/success-response.dto';
import { User } from '../entity/user.entity';
import { GameRepository, VisibleChannelRepository, InvisibleChannelRepository } from '../repository';
import { GameQueue } from '../repository/game-queue';
import { ChannelUser, Game } from '../repository/model';

import { CreateGameRequestDto } from './dto/request/create-game-request.dto';
import { GameGateway } from './game.gateway';

@Injectable()
export class GameService {
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly visibleChannelRepository: VisibleChannelRepository,
    private readonly invisibleChannelRepository: InvisibleChannelRepository,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly gameGateway: GameGateway,
    private readonly gameQueue: GameQueue,
  ) {}

  startGame(userId: number, { gameId, mode }: CreateGameRequestDto): SuccessResponseDto {
    let channel = this.visibleChannelRepository.find(gameId);
    if (channel === undefined && (channel = this.invisibleChannelRepository.find(gameId)) === undefined) {
      throw new NotFoundException('채널이 존재하지 않습니다.');
    }
    if (this.gameRepository.exist(gameId)) {
      throw new ConflictException('해당 채널에서 이미 진행 중인 게임이 있습니다.');
    }

    const { users } = channel;
    const leftPlayer = users.get(userId);
    if (leftPlayer === undefined) {
      throw new ForbiddenException('해당 채널에 참여하지 않았습니다.');
    }
    if (leftPlayer.role !== 'owner') {
      throw new ForbiddenException('채널의 owner 만 게임을 시작할 수 있습니다.');
    }

    let rightPlayer: ChannelUser | null = null;
    for (const userEntry of users) {
      if (userEntry[1].isPlayer === true && userEntry[1].role !== 'owner') {
        rightPlayer = userEntry[1];
        break;
      }
    }
    if (rightPlayer === null) {
      throw new ForbiddenException('플레이어가 2명 이상이어야 게임을 시작할 수 있습니다.');
    }
    this.createGame(gameId, mode, leftPlayer, rightPlayer);
    channel.isInGame = true;
    return { message: '게임이 생성되었습니다.' };
  }

  async joinGameQueue(userId: number): Promise<SuccessResponseDto> {
    if (this.gameQueue.exist(userId)) {
      throw new ConflictException('이미 게임 대기열에 참여 중입니다.');
    }
    this.gameQueue.insert(userId);
    if (this.gameQueue.size() >= 2) {
      const userIds = this.gameQueue.get();
      this.gameQueue.clear();

      const users = await this.userRepository.find({
        select: ['id', 'nickname', 'image'],
        where: [{ id: userIds[0] }, { id: userIds[1] }],
      });
      if (users.length < 2) {
        throw new NotFoundException('존재하지 않는 유저입니다.');
      }

      const gameId = nanoid();
      if (this.gameGateway.joinUserToGameRoom(userIds, gameId) === false) {
        throw new NotFoundException('접속중인 유저가 아닙니다.');
      }
      const leftPlayer = userIds[0] === users[0].id ? users[0] : users[1];
      const rightPlayer = leftPlayer === users[0] ? users[1] : users[0];

      this.createGame(gameId, 'normal', { ...leftPlayer, role: 'member' }, { ...rightPlayer, role: 'member' });
    }
    return { message: '랜덤 게임 대기열에 참여했습니다.' };
  }

  cancelGameQueue(userId: number): SuccessResponseDto {
    if (this.gameQueue.exist(userId) === false) {
      throw new NotFoundException('게임 대기열에 참여하지 않았습니다.');
    }
    this.gameQueue.delete(userId);
    return { message: '게임 대기열에서 나왔습니다.' };
  }

  private createGame(
    gameId: string,
    mode: GameMode,
    leftPlayer: Omit<ChannelUser, 'isPlayer'>,
    rightPlayer: Omit<ChannelUser, 'isPlayer'>,
  ): void {
    const leftPlayerInfo: MemberInfo = {
      userId: leftPlayer.id,
      nickname: leftPlayer.nickname,
      image: leftPlayer.image,
      role: leftPlayer.role,
    };
    const rightPlayerInfo: MemberInfo = {
      userId: rightPlayer.id,
      nickname: rightPlayer.nickname,
      image: rightPlayer.image,
      role: rightPlayer.role,
    };

    const game = new Game(gameId, mode, leftPlayer.id, rightPlayer.id);
    this.gameRepository.insert(game);
    this.gameGateway.updateUserStatus(leftPlayer.id, 'game');
    this.gameGateway.updateUserStatus(rightPlayer.id, 'game');

    setTimeout(() => {
      this.gameGateway.broadcastGameStart(game.gameData.id, mode, leftPlayerInfo, rightPlayerInfo);
    }, 1000);
  }
}

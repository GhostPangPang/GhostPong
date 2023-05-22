import { ForbiddenException, Injectable, NotFoundException, ConflictException } from '@nestjs/common';

import { ChannelRepository } from '../repository/channel.repository';
import { GameRepository } from '../repository/game.repository';
import { ChannelUser } from '../repository/model/channel';
import { Game } from '../repository/model/game';
import { UserStatusRepository } from '../repository/user-status.repository';

import { GameGateway } from './game.gateway';

@Injectable()
export class GameService {
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly channelRepository: ChannelRepository,
    private readonly userStatusRepository: UserStatusRepository,
    private readonly gameGateway: GameGateway,
  ) {}

  createGame(gameId: string, userId: number) {
    const channel = this.channelRepository.find(gameId);
    if (channel === undefined) {
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

    const game = new Game(gameId, leftPlayer.id, rightPlayer.id);
    this.gameRepository.insert(game);
    this.userStatusRepository.update(leftPlayer.id, { status: 'game' });
    this.gameGateway.emitGameStatusToFriends(leftPlayer.id);
    this.userStatusRepository.update(rightPlayer.id, { status: 'game' });
    this.gameGateway.emitGameStatusToFriends(leftPlayer.id);

    channel.isInGame = true;
    this.gameGateway.broadcastGameStart(game.gameData.id);
    return { message: '게임이 생성되었습니다.' };
  }
}

import { ForbiddenException, Injectable, NotFoundException, ConflictException } from '@nestjs/common';

import { MemberInfo } from '@/types/channel';

import { SuccessResponseDto } from '../common/dto/success-response.dto';

import { GameRepository, VisibleChannelRepository, InvisibleChannelRepository } from '../repository';
import { ChannelUser, Game } from '../repository/model';

import { GameGateway } from './game.gateway';

@Injectable()
export class GameService {
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly visibleChannelRepository: VisibleChannelRepository,
    private readonly invisibleChannelRepository: InvisibleChannelRepository,
    private readonly gameGateway: GameGateway,
  ) {}

  createGame(gameId: string, userId: number): SuccessResponseDto {
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

    const game = new Game(gameId, leftPlayer.id, rightPlayer.id);
    this.gameRepository.insert(game);

    this.gameGateway.updateUserStatus(leftPlayer.id, 'game');
    this.gameGateway.updateUserStatus(rightPlayer.id, 'game');

    channel.isInGame = true;
    const leftMemberInfo: MemberInfo = {
      userId: leftPlayer.id,
      nickname: leftPlayer.nickname,
      image: leftPlayer.image,
      role: leftPlayer.role,
    };
    const rightMemberInfo: MemberInfo = {
      userId: rightPlayer.id,
      nickname: rightPlayer.nickname,
      image: rightPlayer.image,
      role: rightPlayer.role,
    };
    this.gameGateway.broadcastGameStart(game.gameData.id, leftMemberInfo, rightMemberInfo);
    return { message: '게임이 생성되었습니다.' };
  }
}

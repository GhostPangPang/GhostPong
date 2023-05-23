import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiConflictResponse, ApiForbiddenResponse, ApiHeaders, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ExtractUserId } from '../common/decorator/extract-user-id.decorator';
import { SuccessResponseDto } from '../common/dto/success-response.dto';

import { PlayerReadyDto } from './dto/player-ready';
import { GameService } from './game.service';

@ApiTags('game')
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @ApiOperation({ summary: '게임 시작' })
  @ApiForbiddenResponse({ description: '채널의 owner 가 아닌 경우, plyer 가 2명이 아닌 경우' })
  @ApiConflictResponse({ description: '해당 채널에서 이미 진행 중인 게임이 있는 경우' })
  @ApiHeaders([{ name: 'x-my-id' }])
  @HttpCode(HttpStatus.OK)
  @Post()
  createGame(@ExtractUserId() userId: number, @Body() { gameId }: PlayerReadyDto): SuccessResponseDto {
    return this.gameService.createGame(gameId, userId);
  }
}

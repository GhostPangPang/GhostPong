import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiConflictResponse, ApiForbiddenResponse, ApiOperation } from '@nestjs/swagger';

import { ExtractUserId } from '../common/decorator/extract-user-id.decorator';
import { SuccessResponseDto } from '../common/dto/success-response.dto';

import { CreateGameRequestDto } from './dto/request/create-game-request.dto';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @ApiOperation({ summary: '게임 시작' })
  @ApiForbiddenResponse({ description: '채널의 owner 가 아닌 경우, plyer 가 2명이 아닌 경우' })
  @ApiConflictResponse({ description: '해당 채널에서 이미 진행 중인 게임이 있는 경우' })
  @HttpCode(HttpStatus.OK)
  @Post()
  createGame(@ExtractUserId() userId: number, @Body() { channelId }: CreateGameRequestDto): SuccessResponseDto {
    return this.gameService.createGame(channelId, userId);
  }
}

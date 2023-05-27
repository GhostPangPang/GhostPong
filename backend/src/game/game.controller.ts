import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiHeaders,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ExtractUserId } from '../common/decorator/extract-user-id.decorator';
import { SuccessResponseDto } from '../common/dto/success-response.dto';

import { CreateGameRequestDto } from './dto/request/create-game-request.dto';
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
  startGame(@ExtractUserId() userId: number, @Body() gameOptions: CreateGameRequestDto): SuccessResponseDto {
    return this.gameService.startGame(userId, gameOptions);
  }

  @ApiOperation({ summary: '랜덤 게임 참가' })
  @ApiNotFoundResponse({ description: '존재하지 않는 유저, 접속 중이지 않은 유저가 큐에 참여한 경우' })
  @ApiConflictResponse({ description: '이미 게임 대기열에 있는 경우' })
  @ApiHeaders([{ name: 'x-my-id' }])
  @HttpCode(HttpStatus.OK)
  @Post('random')
  joinGameQueue(@ExtractUserId() userId: number): Promise<SuccessResponseDto> {
    return this.gameService.joinGameQueue(userId);
  }

  @ApiOperation({ summary: '랜덤 게임 참가 취소' })
  @ApiNotFoundResponse({ description: '게임 대기열에 참여하지 않은 경우' })
  @HttpCode(HttpStatus.OK)
  @Post('random/cancle')
  cancelGameQueue(@ExtractUserId() userId: number): SuccessResponseDto {
    return this.gameService.cancelGameQueue(userId);
  }
}

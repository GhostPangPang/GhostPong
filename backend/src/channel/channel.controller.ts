import { Controller, Post, Body, Res, Get, DefaultValuePipe, Query, Param } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiHeaders,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

import { ExtractUserId } from '../common/decorator/extract-user-id.decorator';
import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { NonNegativeIntPipe } from '../common/pipe/non-negative-int.pipe';

import { ChannelService } from './channel.service';
import { CreateChannelRequestDto } from './dto/request/create-channel-request.dto';
import { ChannelsListResponseDto } from './dto/response/channels-list-response.dto';
import { SuccessResponseDto } from '../common/dto/success-response.dto';
import { JoinChannelRequestDto } from './dto/request/join-channel-request.dto';

@ApiTags('channel')
@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @ApiOperation({ summary: '채널 생성하기' })
  @ApiConflictResponse({ type: ErrorResponseDto, description: '다른 채널에 참여 중인 유저' })
  @ApiHeaders([{ name: 'x-my-id', description: '내 auth 아이디 (임시값)' }])
  @Post()
  async createChannel(
    @ExtractUserId() myId: number,
    @Body() createChannelRequestDto: CreateChannelRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    const channelId = await this.channelService.createChannel(myId, createChannelRequestDto);
    res.setHeader('Location', `'/channel/${channelId}`).json({ message: '채널이 생성되었습니다.' });
  }

  @ApiOperation({ summary: '채널 목록 조회하기' })
  @ApiHeaders([{ name: 'x-my-id', description: '내 auth 아이디 (임시값)' }])
  @ApiQuery({ name: 'cursor', required: false, description: 'channel 의 페이지 cursor' })
  @Get()
  getChannelsList(
    @Query('cursor', new DefaultValuePipe(0), NonNegativeIntPipe) cusror: number,
  ): ChannelsListResponseDto {
    return this.channelService.getChannelsList(cusror);
  }

  @ApiOperation({ summary: '채널에 참여하기' })
  @ApiBadRequestResponse({ type: ErrorResponseDto, description: '비밀번호가 일치하지 않음' })
  @ApiForbiddenResponse({ type: ErrorResponseDto, description: '차단된 유저' })
  @ApiNotFoundResponse({ type: ErrorResponseDto, description: '존재하지 않는 채널' })
  @ApiConflictResponse({ type: ErrorResponseDto, description: '다른 채널에 참여 중인 유저, 채널 정원 초과' })
  @ApiHeaders([{ name: 'x-my-id', description: '내 auth 아이디 (임시값)' }])
  @Post()
  joinChannel(
    @ExtractUserId() myId: number,
    @Body() joinChannelRequestDto: JoinChannelRequestDto,
    @Param('channelId') channelId: string,
  ): Promise<SuccessResponseDto> {
    return this.channelService.joinChannel(myId, joinChannelRequestDto, channelId);
  }
}

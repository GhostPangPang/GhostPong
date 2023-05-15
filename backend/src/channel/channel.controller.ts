import { Controller, Post, Body, Res } from '@nestjs/common';
import { ApiConflictResponse, ApiHeaders, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { ExtractUserId } from '../common/decorator/extract-user-id.decorator';
import { ErrorResponseDto } from '../common/dto/error-response.dto';

import { ChannelService } from './channel.service';
import { CreateChannelRequestDto } from './dto/request/create-channel-request.dto';

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
}

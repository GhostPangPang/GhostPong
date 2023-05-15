import { Controller, Post, Body, Res } from '@nestjs/common';
import { ApiHeaders, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { ExtractUserId } from '../common/decorator/extract-user-id.decorator';

import { ChannelService } from './channel.service';
import { CreateChannelRequestDto } from './dto/request/create-channel-request.dto';

@ApiTags('channel')
@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @ApiHeaders([{ name: 'x-my-id', description: '내 auth 아이디 (임시값)' }])
  @Post()
  async createChannel(
    @ExtractUserId() myId: number,
    @Body() createChannelRequestDto: CreateChannelRequestDto,
    @Res() res: Response,
  ) {
    const channelId = await this.channelService.createChannel(myId, createChannelRequestDto);
    res.setHeader('Location', `'/channel/${channelId}`).json({ message: '채널이 생성되었습니다.' });
  }
}

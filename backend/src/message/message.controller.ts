import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { ErrorResponseDto } from '../common/dto/error-response.dto';

import { MessageResponseDto } from './dto/message-response.dto';
import { MessageService } from './message.service';

@ApiTags('message')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiOperation({ summary: '메시지 리스트 가져오기' })
  @ApiNotFoundResponse({ type: ErrorResponseDto, description: '친구 관계 없음 (친구 삭제됨)' })
  @ApiParam({ name: 'friendId', required: true, description: '대화 나누는 상대 친구와의 friendship의 id' })
  @ApiQuery({ name: 'offset', required: false, description: '마지막으로 가져온 메시지의 id' })
  @Get(':friendId')
  getMessagesList(@Param('friendId') friendId: number, @Query('offset') offset: number): Promise<MessageResponseDto> {
    return this.messageService.getMessagesList(friendId, offset);
  }
}

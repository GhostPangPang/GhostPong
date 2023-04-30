import { ErrorResponseDto } from '../common/dto/error-response.dto';

import { MessageResponseDto } from './dto/response/message-response.dto';
import { MessageService } from './message.service';

import { Controller, Get, Param, Query, Headers } from '@nestjs/common';
import { ApiHeaders, ApiNotFoundResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('message')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiOperation({ summary: '메시지 리스트 가져오기' })
  @ApiNotFoundResponse({ type: ErrorResponseDto, description: '친구 관계 없음 (친구 삭제됨)' })
  @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
  @ApiParam({ name: 'friendId', required: true, description: '대화 나누는 상대 친구와의 friendship의 id' })
  @ApiQuery({ name: 'offset', required: false, description: '마지막으로 가져온 메시지의 id' })
  @Get(':friendId')
  getMessagesList(
    @Param('friendId') friendId: number,
    @Query('offset') offset: number,
    @Headers('x-my-id') myId: number,
  ): Promise<MessageResponseDto> {
    return this.messageService.getMessagesList(myId, friendId, offset);
  }
}

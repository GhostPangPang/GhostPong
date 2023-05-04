import { Controller, Get, Param, Query, Headers, DefaultValuePipe, UseGuards } from '@nestjs/common';
import { ApiHeaders, ApiNotFoundResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { UserGuard } from '../auth/guard/user.guard';
import { ExtractUserId } from '../common/decorator/extract-user-id.decorator';
import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { NonNegativeIntPipe } from '../common/pipe/non-negative-int.pipe';

import { MessageResponseDto } from './dto/response/message-response.dto';
import { MessageService } from './message.service';

@ApiTags('message')
@Controller('message')
@UseGuards(UserGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiOperation({ summary: '메시지 리스트 가져오기' })
  @ApiNotFoundResponse({ type: ErrorResponseDto, description: '친구 관계 없음 (친구 삭제됨)' })
  @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
  @ApiParam({ name: 'friendId', required: true, description: '대화 나누는 상대 친구와의 friendship의 id' })
  @ApiQuery({ name: 'offset', required: false, description: '마지막으로 가져온 메시지의 id' })
  @Get(':friendId')
  getMessagesList(
    @ExtractUserId() myId: number,
    @Param('friendId', NonNegativeIntPipe) friendId: number,
    @Query('offset', new DefaultValuePipe(0), NonNegativeIntPipe) offset: number,
  ): Promise<MessageResponseDto> {
    return this.messageService.getMessagesList(myId, friendId, offset);
  }
}

import { Controller, Headers, Post } from '@nestjs/common';
import { ApiHeaders, ApiNotFoundResponse, ApiOperation, ApiPreconditionFailedResponse, ApiTags } from '@nestjs/swagger';

import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { SuccessResponseDto } from '../common/dto/success-response.dto';

import { BlockedService } from './blocked.service';

@ApiTags('blocked')
@Controller('blocked')
export class BlockedController {
  constructor(private readonly blockedService: BlockedService) {}

  @ApiOperation({ summary: 'id로 유저 차단하기(토글->마우스 이용)' })
  @ApiNotFoundResponse({ type: ErrorResponseDto, description: '유저 없음' })
  @ApiPreconditionFailedResponse({ type: ErrorResponseDto, description: '차단 목록 정원 다참' })
  @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
  @Post('blocked/:userId')
  blockUserById(@Headers('x-my-id') myId: number, userId: number): Promise<SuccessResponseDto> {
    return this.blockedService.blockUserById(myId, userId);
  }
}

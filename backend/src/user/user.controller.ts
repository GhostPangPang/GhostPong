import { Body, Controller, Get, Headers, Patch } from '@nestjs/common';
import { ApiConflictResponse, ApiHeaders, ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { SuccessResponseDto } from '../common/dto/success-response.dto';

import { MetaInfoResponseDto } from './dto/meta-info-response.dto';
import { UpdateImageRequest } from './dto/update-image-request.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '유저 메타 정보 가져오기' })
  @ApiNotFoundResponse({ type: ErrorResponseDto, description: '유저 없음' })
  @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
  @Get()
  getUserMetaInfo(@Headers('x-my-id') myId: number): Promise<MetaInfoResponseDto> {
    return this.userService.getUserMetaInfo(myId);
  }

  @ApiOperation({ summary: '유저 프로필 사진 변경하기' })
  @ApiConflictResponse({ type: ErrorResponseDto, description: '이미지 처리 실패' })
  @ApiNotFoundResponse({ type: ErrorResponseDto, description: 'image value 잘못됨, 존재하지 않는 사용자' })
  @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
  @Patch('image')
  updateProfileImage(
    @Headers('x-my-id') myId: number,
    @Body() updateImageRequest: UpdateImageRequest,
  ): Promise<SuccessResponseDto> {
    return this.userService.updateProfileImage(myId, updateImageRequest.image);
  }
}

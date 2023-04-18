import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Patch, Post } from '@nestjs/common';
import { ApiConflictResponse, ApiHeaders, ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { SuccessResponseDto } from '../common/dto/success-response.dto';

import { NicknameRequestDto } from './dto/nickname-request.dto';
import { NicknameResponseDto } from './dto/nickname-response.dto';
import { UpdateImageRequest } from './dto/update-image-request.dto';
import { UserInfoResponseDto } from './dto/user-info-response.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '유저 메타 정보 가져오기' })
  @ApiNotFoundResponse({ type: ErrorResponseDto, description: '유저 없음' })
  @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
  @Get()
  getUserMetaInfo(@Headers('x-my-id') myId: number): Promise<UserInfoResponseDto> {
    return this.userService.getUserInfo(myId);
  }

  @ApiOperation({ summary: '유저 프로필 사진 변경하기' })
  @ApiNotFoundResponse({ type: ErrorResponseDto, description: '존재하지 않는 사용자' })
  @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
  @Patch('image')
  updateProfileImage(
    @Headers('x-my-id') myId: number,
    @Body() updateImageRequest: UpdateImageRequest,
  ): Promise<SuccessResponseDto> {
    return this.userService.updateProfileImage(myId, updateImageRequest.image);
  }

  @ApiOperation({ summary: '유저 닉네임 변경하기' })
  @ApiConflictResponse({ type: ErrorResponseDto, description: '중복된 닉네임' })
  @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
  @Patch('nickname')
  updateNickname(
    @Headers('x-my-id') myId: number,
    @Body() updateNicknameDto: NicknameRequestDto,
  ): Promise<NicknameResponseDto> {
    return this.userService.updateNickname(myId, updateNicknameDto.nickname);
  }

  @ApiOperation({ summary: '닉네임 초기 설정 && 유저 생성' })
  @ApiConflictResponse({
    type: ErrorResponseDto,
    description: '중복된 nickname 또는 이미 생성된 user(중복된 auth-id)',
  })
  @ApiNotFoundResponse({ type: ErrorResponseDto, description: 'Invalid한 auth-id' })
  @ApiHeaders([{ name: 'x-auth-id', description: '내 auth 아이디 (임시값)' }])
  @HttpCode(HttpStatus.OK)
  @Post()
  createUser(
    @Headers('x-auth-id') authId: number,
    @Body() { nickname }: NicknameRequestDto,
  ): Promise<NicknameResponseDto> {
    return this.userService.createUser(authId, nickname);
  }
}

import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiHeaders,
  ApiNotFoundResponse,
  ApiOperation,
  ApiPayloadTooLargeResponse,
  ApiTags,
  ApiUnsupportedMediaTypeResponse,
} from '@nestjs/swagger';
import { Response } from 'express';

import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { SuccessResponseDto } from '../common/dto/success-response.dto';

import { NicknameRequestDto } from './dto/nickname-request.dto';
import { NicknameResponseDto } from './dto/nickname-response.dto';
import { UpdateImageRequestDto } from './dto/update-image-request.dto';
import { UserInfoResponseDto } from './dto/user-info-response.dto';
import { FileUploadInterceptor } from './interceptor/file-upload.interceptor';
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

  @ApiOperation({ summary: '닉네임 초기 설정 및 유저 생성' })
  @ApiConflictResponse({
    type: ErrorResponseDto,
    description: '중복된 nickname 또는 이미 생성된 user(중복된 auth-id), 이미 registered인 유저',
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

  @ApiOperation({ summary: '이미지 업로드' })
  @ApiConsumes('multipart/form-data')
  @ApiUnsupportedMediaTypeResponse({ type: ErrorResponseDto, description: 'gif, jpeg, png 형식의 파일이 아닌 경우' })
  @ApiPayloadTooLargeResponse({ type: ErrorResponseDto, description: '이미지 용량 초과' })
  @ApiHeaders([{ name: 'x-my-id', required: true, description: '내 아이디' }])
  @ApiBody({ schema: { type: 'object', properties: { image: { type: 'string', format: 'binary' } } } })
  @UseInterceptors(FileUploadInterceptor)
  @Post('image')
  uploadImage(@UploadedFile() file: Express.Multer.File, @Res() res: Response): void {
    res.set('Location', file.path.slice(6));
    res.status(HttpStatus.CREATED).send({
      message: '이미지 업로드 완료되었습니다.',
    });
  }

  @ApiOperation({ summary: '유저 프로필 사진 변경하기' })
  @ApiNotFoundResponse({ type: ErrorResponseDto, description: '존재하지 않는 사용자' })
  @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
  @Patch('image')
  updateProfileImage(
    @Headers('x-my-id') myId: number,
    @Body() updateImageRequestDto: UpdateImageRequestDto,
  ): Promise<SuccessResponseDto> {
    return this.userService.updateUserImage(myId, updateImageRequestDto.image);
  }

  @ApiOperation({ summary: '유저 닉네임 변경하기' })
  @ApiConflictResponse({ type: ErrorResponseDto, description: '중복된 닉네임' })
  @ApiHeaders([{ name: 'x-my-id', description: '내 아이디 (임시값)' }])
  @Patch('nickname')
  updateNickname(
    @Headers('x-my-id') myId: number,
    @Body() updateNicknameDto: NicknameRequestDto,
  ): Promise<NicknameResponseDto> {
    return this.userService.updateUserNickname(myId, updateNicknameDto.nickname);
  }
}

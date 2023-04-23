import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Patch,
  PayloadTooLargeException,
  Post,
  Res,
  UnsupportedMediaTypeException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiHeaders,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { diskStorage } from 'multer';

import { MAX_IMAGE_SIZE } from '../common/constant';
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

  @ApiOperation({ summary: '이미지 업로드' })
  @ApiConsumes('multipart/form-data')
  @ApiHeaders([{ name: 'x-my-id', required: true, description: '내 아이디' }])
  @ApiBody({ schema: { type: 'object', properties: { image: { type: 'string', format: 'binary' } } } })
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.match(/image\/(gif|jpeg|png)/)) {
          cb(new UnsupportedMediaTypeException('gif, jpeg, png 형식의 파일만 업로드 가능합니다.'), false);
        }
        if (file.size > MAX_IMAGE_SIZE) {
          cb(new PayloadTooLargeException('이미지 파일은 4MB 이하로 업로드 가능합니다.'), false);
        }
        cb(null, true);
      },
      storage: diskStorage({
        destination: 'public/asset',
        filename: (req, file, cb) => {
          // FIXME : auth guard 적용 후 req.user.id로 변경
          const myId = req.headers['x-my-id'];
          const extArray = file.mimetype.split('/');
          cb(null, 'profile-' + myId + '.' + extArray[extArray.length - 1]);
        },
      }),
    }),
  )
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
}

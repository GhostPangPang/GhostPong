import {
  Controller,
  Get,
  HttpStatus,
  PayloadTooLargeException,
  Post,
  Res,
  UnsupportedMediaTypeException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiHeaders, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { diskStorage } from 'multer';

import { AppService } from './app.service';
import { MAX_IMAGE_SIZE } from './common/constant';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiOperation({ summary: '이미지 업로드' })
  @ApiConsumes('multipart/form-data')
  @ApiHeaders([{ name: 'x-my-id', required: true, description: '내 아이디' }])
  @ApiBody({ schema: { type: 'object', properties: { image: { type: 'string', format: 'binary' } } } })
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: (req, file, cb) => {
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
}

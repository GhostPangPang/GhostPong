import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  UnsupportedMediaTypeException,
  PayloadTooLargeException,
  CallHandler,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import * as multer from 'multer';
import { FileFilterCallback, diskStorage } from 'multer';
import { Observable } from 'rxjs';

import { MAX_IMAGE_SIZE } from '../../common/constant';

@Injectable()
export class FileUploadInterceptor implements NestInterceptor<void, void> {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<void>> {
    const ctx: HttpArgumentsHost = context.switchToHttp();

    const multerOptions: multer.Options = {
      fileFilter: (_req, file: Express.Multer.File, cb: FileFilterCallback) => {
        if (!file.mimetype.match(/image\/(gif|jpeg|png)/)) {
          cb(new UnsupportedMediaTypeException('gif, jpeg, png 형식의 파일만 업로드 가능합니다.'));
        }
        cb(null, true);
      },
      storage: diskStorage({
        destination: 'public/asset',
        filename: (req, file, cb) => {
          const myId = req.headers['x-my-id'];
          const extArray = file.mimetype.split('/');
          cb(null, 'profile-' + myId + '.' + extArray[extArray.length - 1]);
        },
      }),
      limits: { fileSize: MAX_IMAGE_SIZE },
    };

    await new Promise<void>((resolve, reject) =>
      multer(multerOptions).single('image')(ctx.getRequest(), ctx.getResponse(), (error) => {
        error
          ? reject(
              error.code === 'LIMIT_FILE_SIZE'
                ? new PayloadTooLargeException('이미지 파일은 4MB 이하로 업로드 가능합니다.')
                : error,
            )
          : resolve();
      }),
    );
    return next.handle();
  }
}

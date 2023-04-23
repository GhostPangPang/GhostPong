import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { BlockedModule } from '../blocked/blocked.module';
import { User } from '../entity/user.entity';

import { FileUploadInterceptor } from './interceptor/file-upload.interceptor';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule, forwardRef(() => BlockedModule)],
  controllers: [UserController],
  providers: [UserService, FileUploadInterceptor],
  exports: [UserService],
})
export class UserModule {}

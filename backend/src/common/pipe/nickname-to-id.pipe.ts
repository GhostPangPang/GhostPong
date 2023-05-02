import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { matches } from 'class-validator';

import { UserService } from '../../user/user.service';

@Injectable()
export class NicknameToIdPipe implements PipeTransform<string, Promise<number>> {
  constructor(private readonly userService: UserService) {}
  async transform(nickname: string) {
    // validate
    if (!matches(nickname, /^[가-힣a-zA-Z0-9]{1,8}$/)) {
      throw new BadRequestException('유효하지 않은 닉네임 입니다.');
    }

    // transform
    const user = await this.userService.findExistUserByNickname(nickname);
    return user.id;
  }
}

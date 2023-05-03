import { BadRequestException, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { matches } from 'class-validator';
import { Repository } from 'typeorm';

import { User } from '../../entity/user.entity';

@Injectable()
export class NicknameToIdPipe implements PipeTransform<string, Promise<number>> {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}
  async transform(nickname: string) {
    // validate
    if (!matches(nickname, /^[가-힣a-zA-Z0-9]{1,8}$/)) {
      throw new BadRequestException('유효하지 않은 닉네임 입니다.');
    }

    // transform
    const user = await this.userRepository.findOneBy({ nickname });
    if (user === null) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }
    return user.id;
  }
}

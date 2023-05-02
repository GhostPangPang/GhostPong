import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../entity/user.entity';

@Injectable()
export class CheckUserIdPipe implements PipeTransform<number, Promise<number>> {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}
  async transform(userId: number): Promise<number> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user === null) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }
    return userId;
  }
}

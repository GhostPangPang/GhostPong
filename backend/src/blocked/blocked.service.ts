import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SuccessResponseDto } from '../common/dto/success-response.dto';
import { BlockedUser } from '../entity/blocked-user.entity';
import { User } from '../entity/user.entity';

@Injectable()
export class BlockedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(BlockedUser)
    private readonly blockedUserRepository: Repository<BlockedUser>,
  ) {}

  async blockUserById(myId: number, userId: number): Promise<SuccessResponseDto> {
    await this.blockedUserRepository.insert({ userId: myId, blockedUserId: userId });
    return new SuccessResponseDto('유저를 차단하였습니다.');
  }
}

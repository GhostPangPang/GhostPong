import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DEFAULT_IMAGE } from '../common/constant';
import { Auth } from '../entity/auth.entity';
import { User } from '../entity/user.entity';

import { NicknameSuccessResponseDto } from './dto/nickname-success-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async checkDuplicatedNickname(nickname: string): Promise<void> {
    // check duplicated nickname
    if (await this.userRepository.findOneBy({ nickname })) {
      throw new ConflictException('중복된 닉네임입니다.');
    }
  }

  // create new User's nickname
  async createNickname(authId: number, nickname: string): Promise<NicknameSuccessResponseDto> {
    await this.checkDuplicatedNickname(nickname);
    await this.userRepository.insert({
      id: authId,
      nickname: nickname,
      exp: 0,
      image: DEFAULT_IMAGE,
    });
    return new NicknameSuccessResponseDto(nickname);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Auth } from '../entity/auth.entity';
import { UserService } from '../user/user.service';

import { NicknameResponseDto } from './dto/nickname-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly userService: UserService,
  ) {}

  async checkAuthId(authId: number): Promise<void> {
    if ((await this.authRepository.findOneBy({ id: authId })) === null) {
      throw new NotFoundException('존재하지 않는 인증 정보입니다.');
    }
  }

  async createUser(authId: number, nickname: string): Promise<NicknameResponseDto> {
    await this.checkAuthId(authId);
    await this.userService.createUser(authId, nickname);
    return new NicknameResponseDto(nickname);
  }
}

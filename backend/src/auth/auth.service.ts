import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Auth, AuthStatus } from '../entity/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
  ) {}

  async checkAuthId(authId: number): Promise<void> {
    if ((await this.authRepository.findOneBy({ id: authId })) === null) {
      throw new NotFoundException('존재하지 않는 인증 정보입니다.');
    }
  }

  async changeAuthStatus(authId: number): Promise<void> {
    await this.authRepository.update({ id: authId }, { status: AuthStatus.REGISTERD });
  }
}

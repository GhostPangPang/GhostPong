import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { JwtService } from '@nestjs/jwt';

import { Auth, AuthStatus } from '../entity/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
  ) {}

  async checkExistAuthId(authId: number): Promise<void> {
    const auth = await this.authRepository.findOneBy({ id: authId });
    if (auth === null) {
      throw new NotFoundException('존재하지 않는 인증 정보입니다.');
    }
    if (auth.status === AuthStatus.REGISTERD) {
      throw new ConflictException('이미 등록된 유저입니다.');
    }
  }
}

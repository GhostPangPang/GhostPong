import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Auth, AuthStatus } from '../entity/auth.entity';

import { LoginRequestDto } from './dto/login-request.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly jwtService: JwtService,
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

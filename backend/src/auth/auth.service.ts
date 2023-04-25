import { ConflictException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Auth, AuthStatus } from '../entity/auth.entity';
import { UserService } from '../user/user.service';

import { LoginInfoDto } from './dto/login-info.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
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

  async updateAuthStatus(authId: number): Promise<void> {
    await this.authRepository.update({ id: authId }, { status: AuthStatus.REGISTERD });
  }

  // UNREGISTERD -> SIGN UP (Register)
  async signUp(user: LoginInfoDto): Promise<string> {
    const auth = await this.authRepository.findOneBy({ email: user.email });

    if (auth === null) {
      user.id = (await this.authRepository.insert({ email: user.email })).identifiers[0].id;
      console.log(user.id);
    } else {
      user.id = auth.id;
    }
    // const payload = { userId: user.id, email: user.email };
    const payload = { userId: user.id };
    return this.jwtService.sign(payload);
  }

  // REGISTERD -> SIGN IN (Login)
  async signIn(user: LoginInfoDto): Promise<string> {
    // const payload = { userId: user.id, email: user.email };
    const payload = { userId: user.id };
    return this.jwtService.sign(payload);
  }
}

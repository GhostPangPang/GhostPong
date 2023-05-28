import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

import { JwtPayload } from '../../common/type/jwt-payload';
import { JwtConfigService } from '../../config/auth/jwt/configuration.service';
import { User } from '../../entity/user.entity';

@Injectable()
export class UserStrategy extends PassportStrategy(Strategy, 'user') {
  constructor(
    private readonly jwtConfigService: JwtConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfigService.userSecretKey,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userRepository.findOneBy({ id: payload.userId });
    if (user === null) {
      throw new UnauthorizedException('존재하지 않는 유저입니다.');
    }
    const token = {
      userId: payload.userId,
    };
    return token;
  }
}

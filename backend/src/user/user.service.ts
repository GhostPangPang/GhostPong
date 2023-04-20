import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuthService } from '../auth/auth.service';
import { DEFAULT_IMAGE } from '../common/constant';
import { SuccessResponseDto } from '../common/dto/success-response.dto';
import { BlockedUser } from '../entity/blocked-user.entity';
import { User } from '../entity/user.entity';

import { NicknameResponseDto } from './dto/nickname-response.dto';
import { UserInfoResponseDto } from './dto/user-info-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(BlockedUser)
    private readonly blockedUserRepository: Repository<BlockedUser>,
    private readonly authService: AuthService,
  ) {}

  async getUserInfo(myId: number): Promise<UserInfoResponseDto> {
    const userInfo = await this.findExistUserById(myId);
    const numbers = await this.findBlockedByUserId(myId);
    return new UserInfoResponseDto(userInfo, numbers);
  }

  async updateProfileImage(myId: number, imageUrl: string): Promise<SuccessResponseDto> {
    await this.findExistUserById(myId);
    await this.userRepository.update({ id: myId }, { image: imageUrl });
    return new SuccessResponseDto('이미지 변경 완료되었습니다.');
  }

  async updateNickname(myId: number, nickname: string): Promise<NicknameResponseDto> {
    await this.checkDuplicatedNickname(nickname);
    await this.userRepository.update({ id: myId }, { nickname: nickname });
    return new NicknameResponseDto(nickname);
  }

  async createUser(authId: number, nickname: string): Promise<NicknameResponseDto> {
    await this.authService.checkExistAuthId(authId);
    await this.checkAlreadyExistUser(authId);
    await this.checkDuplicatedNickname(nickname);
    // TODO: Add transcation
    await this.userRepository.insert({
      id: authId,
      nickname: nickname,
      image: DEFAULT_IMAGE,
    });
    await this.authService.changeAuthStatus(authId);
    return new NicknameResponseDto(nickname);
  }

  /* 
  validation method
  */

  async findExistUserById(userId: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user === null) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }
    return user;
  }

  async findExistUserByNickname(nickname: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ nickname: nickname });

    if (user === null) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }
    return user;
  }

  private async checkDuplicatedNickname(nickname: string): Promise<void> {
    // check duplicated nickname
    if (await this.userRepository.findOneBy({ nickname })) {
      throw new ConflictException('중복된 닉네임입니다.');
    }
  }

  private async checkAlreadyExistUser(userId: number): Promise<void> {
    if (await this.userRepository.findOneBy({ id: userId })) {
      throw new ConflictException('이미 존재하는 user입니다.');
    }
  }

  /* 
  repository method
  */
  // TODO: blocked 도메인으로 바꾸기
  async findBlockedByUserId(userId: number): Promise<number[]> {
    return (await this.blockedUserRepository.findBy({ userId: userId })).map(
      (blockedUser) => blockedUser.blockedUserId,
    );
  }
}

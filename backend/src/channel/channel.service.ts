import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PARTICIPANT_LIMIT } from '../common/constant';
import { SuccessResponseDto } from '../common/dto/success-response.dto';
import { User } from '../entity/user.entity';
import { ChannelRepository } from '../repository/channel.repository';
import { ChannelUser, ChannelRole } from '../repository/model/channel';
import { PrivateChannelRepository } from '../repository/private-channel.repository';

import { CreateChannelRequestDto } from './dto/request/create-channel-request.dto';
import { ChannelsListResponseDto } from './dto/response/channels-list-response.dto';
import { JoinChannelRequestDto } from './dto/request/join-channel-request.dto';
import { Channel } from '../repository/model/channel';

@Injectable()
export class ChannelService {
  constructor(
    private readonly channelRepository: ChannelRepository,
    private readonly privateChannelRepository: PrivateChannelRepository,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  logger: Logger = new Logger('ChannelService');

  /**
   * 채널을 생성한다. protected 인 경우만 password 를 입력받는다.
   *
   * @param createChannelRequestDto 생성할 채널의 정보가 담긴 dto
   * @returns 새로 생성된 채널의 id
   */
  async createChannel(myId: number, channelOptions: CreateChannelRequestDto): Promise<string> {
    this.checkUserAlreadyInChannel(myId);
    const channel = this.channelRepository.create(channelOptions);
    channel.users.set(myId, await this.generateChannelUser(myId, 'owner'));
    this.logger.log(`createChannel: ${JSON.stringify(channel)}`);
    if (channel.mode === 'private') {
      return this.privateChannelRepository.insert(channel);
    }
    return this.channelRepository.insert(channel);
  }

  getChannelsList(cursor: number): ChannelsListResponseDto {
    const channels = this.channelRepository.findByCursor(cursor).map(({ id, name, mode, users }) => {
      return { id, name, mode, count: users.size };
    });
    return {
      total: cursor === 0 ? this.channelRepository.count() : undefined,
      channels,
    };
  }

  /**
   *  채널에 참여한다.
   * @param myId
   * @param joinChannelRequestDto
   */
  async joinChannel(
    myId: number,
    joinChannelRequestDto: JoinChannelRequestDto,
    channelId: string,
  ): Promise<SuccessResponseDto> {
    this.checkUserAlreadyInChannel(myId);

    // TODO channelID가 존재하는지 확인하는 파이프 필요한지
    const channel: Channel | undefined = this.channelRepository.find(channelId);
    if (channel === undefined) {
      throw new NotFoundException('해당 채널을 찾을 수 없습니다.');
    }
    if (channel.mode === 'protected') {
      if (channel.password !== joinChannelRequestDto.password) {
        throw new BadRequestException('비밀번호가 일치하지 않습니다.');
      }
    }
    if (channel.bannedUserIdList.find((elem) => elem === myId) !== undefined) {
      throw new ForbiddenException('채널에 들어갈 권한이 없습니다.');
    }
    if (channel.users.size >= PARTICIPANT_LIMIT) {
      throw new ConflictException('채널 정원이 초과되었습니다.');
    }
    this.channelRepository.update(channelId, {
      users: channel.users.set(myId, await this.generateChannelUser(myId, 'member')),
    });
    return {
      message: '채널에 참여하였습니다.',
    };
  }

  // SECTION: private
  /**
   * 채널 참여 시 user의 id를 이용해 channelUser 를 생성한다.
   *
   * @param myId user의 id
   * @param role channelUser의 role - create 시 owner, join 시 general
   * @returns
   */
  private async generateChannelUser(myId: number, role: ChannelRole): Promise<ChannelUser> {
    const user = await this.userRepository.findOne({ select: ['id', 'nickname', 'image'], where: { id: myId } });
    if (user === null) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }
    return new ChannelUser(role, user.id, user.nickname, user.image);
  }

  /**
   * 채널에 있는 유저 목록 중 userId 를 가진 유저가 있는지 확인한다.
   *
   * @param userId
   */
  private checkUserAlreadyInChannel(userId: number): void {
    const channels = [...this.channelRepository.findAll(), ...this.privateChannelRepository.findAll()];

    channels.forEach((channel) => {
      if (channel.users.has(userId)) {
        throw new ConflictException('이미 참여중인 채널이 있습니다.');
      }
    });
  }
  // !SECTION : private
}

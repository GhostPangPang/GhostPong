import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entity/user.entity';
import { ChannelRepository } from '../repository/channel.repository';
import { Channel, ChannelUser, ChannelRole } from '../repository/model/channel';
import { PrivateChannelRepository } from '../repository/private-channel.repository';

import { CreateChannelRequestDto } from './dto/request/create-channel-request.dto';

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
  async createChannel(myId: number, { mode, name, password }: CreateChannelRequestDto): Promise<string> {
    this.checkUserAlreadyInChannel(myId);

    const channel = new Channel(mode, name, password);
    channel.users.set(myId, await this.generateChannelUser(myId, 'owner'));
    console.log(channel.users.get(myId));

    this.logger.log(channel.users);
    this.logger.log(`createChannel: ${JSON.stringify(channel)}`);
    if (mode === 'private') {
      return this.privateChannelRepository.insert(channel);
    }
    return this.channelRepository.insert(channel);
  }

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
        throw new ConflictException('이미 채널에 참여중입니다.');
      }
    });
  }
}

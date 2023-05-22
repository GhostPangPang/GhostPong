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

import { ChannelRole, MemberInfo } from '@/types/channel';

import { ChannelRepository } from 'src/repository/channel.repository';

import { PARTICIPANT_LIMIT } from '../common/constant';
import { SuccessResponseDto } from '../common/dto/success-response.dto';
import { Friendship } from '../entity/friendship.entity';
import { User } from '../entity/user.entity';
import { InvisibleChannelRepository } from '../repository/invisible-channel.repository';
import { InvitationRepository } from '../repository/invitation.repository';
import { ChannelUser, Channel } from '../repository/model/channel';
import { SocketIdRepository } from '../repository/socket-id.repository';
import { VisibleChannelRepository } from '../repository/visible-channel.repository';

import { ChannelGateway } from './channel.gateway';
import { CreateChannelRequestDto } from './dto/request/create-channel-request.dto';
import { JoinChannelRequestDto } from './dto/request/join-channel-request.dto';
import { ChannelsListResponseDto } from './dto/response/channels-list-response.dto';
import { FullChannelInfoResponseDto } from './dto/response/full-channel-info-response.dto';

@Injectable()
export class ChannelService {
  constructor(
    private readonly visibleChannelRepository: VisibleChannelRepository,
    private readonly invisibleChannelRepository: InvisibleChannelRepository,
    private readonly invitationRepository: InvitationRepository,
    private readonly socketIdRepository: SocketIdRepository,
    private readonly channelGateway: ChannelGateway,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>,
  ) {}
  logger: Logger = new Logger('ChannelService');

  /**
   * @summary 채널 목록 조회하기
   */
  getChannelsList(cursor: number): ChannelsListResponseDto {
    const channels = this.visibleChannelRepository.findByCursor(cursor).map(({ id, name, mode, users }) => {
      return { id, name, mode, count: users.size };
    });
    return {
      total: cursor === 0 ? this.visibleChannelRepository.count() : undefined,
      channels,
    };
  }

  /**
   * @summary 채널 정보 조회하기
   */
  getChannelInfo(myId: number, channel: Channel): FullChannelInfoResponseDto {
    const channelUser = channel.users.get(myId);
    if (channelUser === undefined) {
      throw new ForbiddenException('해당 채널에 참여중인 유저가 아닙니다.');
    }
    const users = [...channel.users.values()];
    const players: MemberInfo[] = users
      .filter((user) => user.isPlayer)
      .map((user) => {
        return {
          userId: user.id,
          nickname: user.nickname,
          image: user.image,
          role: user.role,
        };
      });
    const observers: MemberInfo[] = users
      .filter((user) => !user.isPlayer)
      .map((user) => {
        return {
          userId: user.id,
          nickname: user.nickname,
          image: user.image,
          role: user.role,
        };
      });
    return {
      players,
      observers,
      isInGame: channel.isInGame,
      name: channel.name,
    };
  }

  /**
   * 채널을 생성한다. protected 인 경우만 password 를 입력받는다.
   *
   * @param createChannelRequestDto 생성할 채널의 정보가 담긴 dto
   * @returns 새로 생성된 채널의 id
   */
  async createChannel(myId: number, channelOptions: CreateChannelRequestDto): Promise<string> {
    this.checkUserAlreadyInChannel(myId);
    let channel;
    let channelId;

    const socket = this.socketIdRepository.find(myId);
    if (socket === undefined) {
      throw new NotFoundException('소켓 아이디를 찾을 수 없습니다.');
    }

    if (channelOptions.mode === 'private') {
      channel = this.invisibleChannelRepository.create(channelOptions);
      channelId = this.invisibleChannelRepository.insert(channel);
    } else {
      channel = this.visibleChannelRepository.create(channelOptions);
      channelId = this.visibleChannelRepository.insert(channel);
    }
    channel.users.set(myId, await this.generateChannelUser(myId, 'owner'));
    this.channelGateway.joinChannel(socket.socketId, channel.id);

    this.logger.log(`createChannel: ${JSON.stringify(channel)}`);
    return channelId;
  }

  /**
   *  채널에 참여한다.
   * @param myId
   * @param joinChannelRequestDto
   */
  async joinChannel(
    myId: number,
    joinChannelRequestDto: JoinChannelRequestDto,
    channel: Channel,
  ): Promise<SuccessResponseDto> {
    this.checkUserAlreadyInChannel(myId);
    this.checkJoinChannel(myId, joinChannelRequestDto, channel);

    const socket = this.socketIdRepository.find(myId);
    if (socket === undefined) {
      throw new NotFoundException('소켓 아이디를 찾을 수 없습니다.');
    }

    const user = await this.userRepository.findOne({
      where: { id: myId },
      select: ['nickname', 'image'],
    });
    if (user === null) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }

    const data = await this.insertNewMember(myId, channel);
    this.channelGateway.joinChannel(socket.socketId, channel.id);
    this.channelGateway.emitChannel<MemberInfo>(channel.id, 'new-member', data, socket.socketId);

    return {
      message: '채널에 입장했습니다.',
    };
  }

  /**
   * 채널 초대하기
   */
  async inviteChannel(myId: number, userId: number, channel: Channel): Promise<SuccessResponseDto> {
    if (channel.users.has(myId) === false) {
      throw new ForbiddenException('채널에 참여중인 유저만 초대 가능합니다.');
    }
    const socketId = this.socketIdRepository.find(userId);
    if (socketId === undefined) {
      throw new NotFoundException('소켓 아이디를 찾을 수 없습니다.');
    }
    await this.checkExistFriendship(myId, userId);
    this.invitationRepository.insert({ userId: userId, channelId: channel.id });
    this.channelGateway.emitUser<{ userId: number }>(socketId.socketId, 'invite-channel', { userId });

    return {
      message: '채널 초대에 성공했습니다.',
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
    const channels = [...this.visibleChannelRepository.findAll(), ...this.invisibleChannelRepository.findAll()];

    for (const channel of channels) {
      if (channel.users.has(userId)) {
        throw new ConflictException('이미 참여중인 채널이 있습니다.');
      }
    }
  }

  /**
   * @description 채널 입장 시 채널의 모드, 비밀번호, 초대 여부, 차단 여부, 정원 초과 확인
   */
  private checkJoinChannel(myId: number, joinChannelRequestDto: JoinChannelRequestDto, channel: Channel): void {
    if (channel.mode !== joinChannelRequestDto.mode) {
      throw new BadRequestException('채널의 모드가 일치하지 않습니다.');
    }
    if (channel.mode === 'protected' && channel.password !== joinChannelRequestDto.password) {
      throw new ForbiddenException('비밀번호가 일치하지 않습니다.');
    }
    if (channel.mode === 'private' && this.invitationRepository.find(myId) === undefined) {
      throw new ForbiddenException('초대가 필요한 채널입니다.');
    }
    this.invitationRepository.delete(myId);
    if (channel.bannedUserIdList.find((elem) => elem === myId) !== undefined) {
      throw new ForbiddenException('차단되어 입장이 불가능한 채널입니다.');
    }
    if (channel.users.size >= PARTICIPANT_LIMIT) {
      throw new ForbiddenException('채널 정원이 초과되었습니다.');
    }
  }

  private async insertNewMember(myId: number, channel: Channel): Promise<MemberInfo> {
    const channelUser = await this.generateChannelUser(myId, 'member');
    let repository: ChannelRepository = this.visibleChannelRepository;
    if (channel.mode === 'private') {
      repository = this.invisibleChannelRepository;
    }
    repository.update(channel.id, {
      users: channel.users.set(myId, channelUser),
    });

    return {
      userId: channelUser.id,
      nickname: channelUser.nickname,
      image: channelUser.image,
      role: channelUser.role,
    };
  }

  private async checkExistFriendship(myId: number, userId: number): Promise<void> {
    const friendship = await this.friendshipRepository.findOne({
      where: [
        { senderId: myId, receiverId: userId, accept: true },
        { senderId: userId, receiverId: myId, accept: true },
      ],
      select: ['id'],
    });
    if (friendship === null) {
      throw new ForbiddenException('친구만 초대 가능합니다.');
    }
  }

  // !SECTION : private
}

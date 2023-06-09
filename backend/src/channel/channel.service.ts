import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash, compare } from 'bcrypt';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';

import { ChannelRole, FullChannelInfoResponse, MemberInfo, UpdatedMode, UserId } from '@/types/channel';
import { ChannelInvited } from '@/types/user';

import { MUTE_EXPIRES_IN, PARTICIPANT_LIMIT } from '../common/constant';
import { SuccessResponseDto } from '../common/dto/success-response.dto';
import { ConnectionGateway } from '../connection/connection.gateway';
import { Friendship } from '../entity/friendship.entity';
import { User } from '../entity/user.entity';
import {
  ChannelRepository,
  InvisibleChannelRepository,
  InvitationRepository,
  SocketIdRepository,
  VisibleChannelRepository,
} from '../repository';
import { ChannelUser, Channel } from '../repository/model';

import { ChannelGateway } from './channel.gateway';
import { CreateChannelRequestDto } from './dto/request/create-channel-request.dto';
import { JoinChannelRequestDto } from './dto/request/join-channel-request.dto';
import { UpdateChannelRequestDto } from './dto/request/update-channel-request.dto';
import { ChannelsListResponseDto } from './dto/response/channels-list-response.dto';

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
    private readonly connectionGateway: ConnectionGateway,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
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
  getChannelInfo(myId: number, channel: Channel): FullChannelInfoResponse {
    this.findExistChannelUser(myId, channel);
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
      mode: channel.mode,
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
    const socketId = this.findExistSocket(myId);

    let channelRepository: ChannelRepository;
    if (channelOptions.mode === 'private') {
      channelRepository = this.invisibleChannelRepository;
    } else {
      channelRepository = this.visibleChannelRepository;
      if (channelOptions.password !== undefined) {
        channelOptions.password = await hash(channelOptions.password, 5);
      }
    }
    const channel = channelRepository.create(channelOptions);
    const channelId = channelRepository.insert(channel);
    channel.users.set(myId, await this.generateChannelUser(myId, 'owner'));
    this.channelGateway.joinChannel(socketId, channel.id);
    return channelId;
  }

  /**
   *  채널에 참여한다.
   * @param myId
   * @param joinOptions
   */
  async joinChannel(myId: number, joinOptions: JoinChannelRequestDto, channel: Channel): Promise<SuccessResponseDto> {
    this.checkUserAlreadyInChannel(myId);
    await this.checkJoinChannel(myId, joinOptions, channel);
    const socketId = this.findExistSocket(myId);
    const data = await this.insertNewMember(myId, channel);

    this.channelGateway.joinChannel(socketId, channel.id);
    this.channelGateway.emitChannel<MemberInfo>(channel.id, 'new-member', data, socketId);

    return {
      message: '채널에 입장했습니다.',
    };
  }

  /**
   * 채널 초대하기
   */
  async inviteChannel(myId: number, targetId: number, channel: Channel): Promise<SuccessResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: myId },
      select: ['nickname'],
    });
    if (user === null) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }
    this.findExistChannelUser(myId, channel);
    const userSocketId = this.findExistSocket(targetId);
    await this.checkExistFriendship(myId, targetId);
    this.invitationRepository.insert({ userId: targetId, channelId: channel.id });
    this.channelGateway.emitUser<ChannelInvited>(userSocketId, 'channel-invited', {
      channelId: channel.id,
      nickname: user.nickname,
    });

    return {
      message: '채널 초대에 성공했습니다.',
    };
  }

  /**
   * @description 초대된 채널에 참여하기
   */
  async joinInvitedChannel(myId: number, channel: Channel): Promise<SuccessResponseDto> {
    this.checkUserAlreadyInChannel(myId);
    if (this.invitationRepository.find(myId) === undefined) {
      throw new NotFoundException('초대가 필요합니다.');
    }
    const socketId = this.findExistSocket(myId);
    const data = await this.insertNewMember(myId, channel);

    this.channelGateway.joinChannel(socketId, channel.id);
    this.channelGateway.emitChannel<MemberInfo>(channel.id, 'new-member', data, socketId);
    this.invitationRepository.delete(myId);
    return {
      message: '초대된 채널에 참여했습니다.',
    };
  }

  /**
   * @description 채널 정보(mode, password) 수정하기
   */
  async updateChannel(
    myId: number,
    channel: Channel,
    updateChannelOptions: UpdateChannelRequestDto,
  ): Promise<SuccessResponseDto> {
    const user = this.findExistChannelUser(myId, channel);
    if (user.role !== 'owner') {
      throw new ForbiddenException('방장만 수정 가능합니다.');
    }
    if (channel.isInGame === true) {
      throw new ForbiddenException('게임 진행중에 처리할 수 없습니다.');
    }
    const socketId = this.findExistSocket(myId);

    if (channel.mode !== updateChannelOptions.mode) {
      if (channel.mode === 'private') {
        this.visibleChannelRepository.insert(channel);
        this.invisibleChannelRepository.delete(channel.id);
      } else if (updateChannelOptions.mode === 'private') {
        this.invisibleChannelRepository.insert(channel);
        this.visibleChannelRepository.delete(channel.id);
      }
    }
    if (updateChannelOptions.mode === 'protected' && updateChannelOptions.password !== undefined) {
      channel.password = await hash(updateChannelOptions.password, 5);
    } else if (channel.mode === 'protected') {
      channel.password = undefined;
    }
    channel.mode = updateChannelOptions.mode;
    this.channelGateway.emitChannel<UpdatedMode>(channel.id, 'channel-updated', { mode: channel.mode }, socketId);
    return {
      message: '채널 정보를 수정했습니다.',
    };
  }

  /**
   * @description 플레이어로 참여하기
   * @param myId
   * @param channel
   */
  becomePlayer(myId: number, channel: Channel): SuccessResponseDto {
    const channelUser = this.findExistChannelUser(myId, channel);
    let count = 0;

    if (channel.isInGame === true) {
      throw new ForbiddenException('게임 진행중에 처리할 수 없습니다.');
    }
    if (channelUser.isPlayer === true) {
      throw new ConflictException('이미 플레이어입니다.');
    }
    for (const user of channel.users.values()) {
      if (user.isPlayer === true && ++count === 2) {
        throw new ForbiddenException('플레이어 정원이 찼습니다.');
      }
    }
    const socketId = this.findExistSocket(myId);
    channelUser.isPlayer = true;
    this.channelGateway.emitChannel<UserId>(channel.id, 'player', { userId: myId }, socketId);
    return {
      message: '플레이어가 되었습니다.',
    };
  }

  /**
   * @description Admin 권한 부여하기
   * @param myId
   * @param targetId 부여할 유저의 id
   * @param channel
   */
  assignAdminPrivileges(myId: number, targetId: number, channel: Channel): SuccessResponseDto {
    const user = this.findExistChannelUser(myId, channel);
    if (user.role !== 'owner' && user.role !== 'admin') {
      throw new ForbiddenException('관리자 권한이 없습니다.');
    }
    const target = this.findExistChannelUser(targetId, channel);
    if (target.role === 'owner' || target.role === 'admin') {
      throw new ConflictException('이미 관리자 권한을 가진 유저입니다.');
    }
    const socketId = this.findExistSocket(myId);
    target.role = 'admin';
    this.channelGateway.emitChannel<UserId>(channel.id, 'admin', { userId: targetId }, socketId);
    return {
      message: '관리자 권한을 부여했습니다.',
    };
  }

  /**
   * @description owner 되기
   * @param myId
   * @param channel
   */
  becomeOwner(myId: number, channel: Channel): SuccessResponseDto {
    const channelUser = this.findExistChannelUser(myId, channel);
    if (channel.isInGame === true) {
      throw new ForbiddenException('게임 진행중에 처리할 수 없습니다.');
    }
    if (channelUser.role === 'owner') {
      throw new ConflictException('이미 방장입니다.');
    }
    for (const user of channel.users.values()) {
      if (user.role === 'owner') {
        throw new ConflictException('방장이 존재합니다.');
      }
    }
    channelUser.role = 'owner';
    channelUser.isPlayer = true;
    this.channelGateway.emitChannel<UserId>(channel.id, 'owner', { userId: myId });
    return {
      message: '방장이 되었습니다.',
    };
  }

  /**
   * mute 하기
   */
  async muteUser(myId: number, channel: Channel, targetId: number): Promise<SuccessResponseDto> {
    this.checkOperationAuthority(myId, channel, targetId);
    await this.cacheManager.set(`mute-${targetId}`, true, MUTE_EXPIRES_IN);
    return { message: 'mute 되었습니다.' };
  }

  /**
   * kick 하기
   */
  async kickUser(myId: number, channel: Channel, targetId: number): Promise<SuccessResponseDto> {
    this.checkOperationAuthority(myId, channel, targetId);
    await this.cacheManager.del(`mute-${targetId}`);
    this.channelGateway.emitChannel<UserId>(channel.id, 'kicked', { userId: targetId });
    this.connectionGateway.leaveChannel(targetId, channel);
    return { message: 'kick 되었습니다.' };
  }

  /**
   * ban 하기
   */
  async banUser(myId: number, channel: Channel, targetId: number): Promise<SuccessResponseDto> {
    this.checkOperationAuthority(myId, channel, targetId);
    await this.cacheManager.del(`mute-${targetId}`);
    channel.bannedUserIdList.push(targetId);
    this.channelGateway.emitChannel<UserId>(channel.id, 'banned', { userId: targetId });
    this.connectionGateway.leaveChannel(targetId, channel);
    return { message: 'ban 되었습니다.' };
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
   * @description 채널에 참여중인 유저인지 확인
   * @param myId
   * @param channel
   */
  private findExistChannelUser(myId: number, channel: Channel): ChannelUser {
    const user = channel.users.get(myId);
    if (user === undefined) {
      throw new ForbiddenException('해당 채널에 참여중인 유저가 아닙니다.');
    }
    return user;
  }

  /**
   * @description 채널 입장 시 채널의 모드, 비밀번호, 초대 여부, 차단 여부, 정원 초과 확인
   */
  private async checkJoinChannel(myId: number, joinOptions: JoinChannelRequestDto, channel: Channel): Promise<void> {
    const { mode, password, users, bannedUserIdList } = channel;
    if (mode !== joinOptions.mode) {
      throw new BadRequestException('채널의 모드가 일치하지 않습니다.');
    }
    if (mode === 'private' && this.invitationRepository.find(myId) === undefined) {
      throw new ForbiddenException('초대가 필요한 채널입니다.');
    }
    if (
      mode === 'protected' &&
      password !== undefined &&
      joinOptions.password !== undefined &&
      (await compare(joinOptions.password, password)) === false
    ) {
      throw new ForbiddenException('비밀번호가 일치하지 않습니다.');
    }
    if (bannedUserIdList.find((elem) => elem === myId) !== undefined) {
      throw new ForbiddenException('Ban 되어 입장이 불가능한 채널입니다.');
    }
    if (users.size >= PARTICIPANT_LIMIT) {
      throw new ForbiddenException('채널 정원이 초과되었습니다.');
    }
    this.invitationRepository.delete(myId);
  }

  private async insertNewMember(myId: number, channel: Channel): Promise<MemberInfo> {
    const channelUser = await this.generateChannelUser(myId, 'member');
    channel.users.set(myId, channelUser);

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

  /**
   * @description socketIdRepository 에서 userId 에 해당하는 socketId 를 찾아 반환
   * @param userId
   * @returns socketId: string
   */
  private findExistSocket(userId: number): string {
    const socket = this.socketIdRepository.find(userId);
    if (socket === undefined) {
      throw new NotFoundException('접속중인 유저가 아닙니다.');
    }
    return socket.socketId;
  }

  /**
   * @description channel operation 권한 확인
   * @param myId
   * @param channel
   * @param userId
   */
  private checkOperationAuthority(myId: number, channel: Channel, targetId: number): void {
    const user = channel.users.get(myId);
    if (user === undefined) {
      throw new ForbiddenException('채널에 참여하지 않은 유저입니다.');
    }
    if (user.role === 'member') {
      throw new ForbiddenException('kick, ban, mute 권한이 없습니다.');
    }
    if (targetId === myId) {
      throw new ConflictException('자기 자신은 kick, ban, mute 할 수 없습니다.');
    }
    const target = channel.users.get(targetId);
    if (target === undefined) {
      throw new NotFoundException('대상이 채널에 참여하지 않은 유저입니다.');
    }
    if (channel.isInGame === true && target.isPlayer === true) {
      throw new ForbiddenException('게임 중인 유저는 kick, ban, mute 할 수 없습니다.');
    }
    if (target.role === 'owner') {
      throw new ForbiddenException('방장을 kick, ban, mute 할 수 없습니다');
    }
  }

  // !SECTION : private
}

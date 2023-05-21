import { ChannelMemberInfoResponse, MemberInfo } from '@/types/channel';

export class ChannelMemberInfoResponseDto implements ChannelMemberInfoResponse {
  /**
   * @description 채널에 접속한 플레이어 목록
   */
  players: MemberInfo[];

  /**
   * @description 채널에 접속한 관전자 목록
   */
  observers: MemberInfo[];
}

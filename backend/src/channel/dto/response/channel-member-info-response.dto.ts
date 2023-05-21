import { ChannelMemberInfoResponse, MemberInfo } from '@/types/channel/response';

export class ChannelMemberInfoResponseDto implements ChannelMemberInfoResponse {
  /**
   * @description 채널에 접속한 플레이어 목록
   */
  players: MemberInfo[];

  /**
   * @description 채널에 접속한 관전자 목록
   */
  oberservers: MemberInfo[];
}

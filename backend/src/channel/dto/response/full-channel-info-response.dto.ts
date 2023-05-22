import { FullChannelInfoResponse, MemberInfo } from '@/types/channel';

export class FullChannelInfoResponseDto implements FullChannelInfoResponse {
  /**
   * @description 채널에 접속한 플레이어 목록
   */
  players: MemberInfo[];

  /**
   * @description 채널에 접속한 관전자 목록
   */
  observers: MemberInfo[];

  /**
   * @description 채널이 게임 중인지 여부
   */
  isInGame: boolean;
}

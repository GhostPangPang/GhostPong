import { ChannelInfoResponse, MemberInfo } from '@/types/channel/response';

export class ChannelInfoResponseDto implements ChannelInfoResponse {
  /**
   * @description 채널 이름
   * @example '아무나 들어와~'
   */
  name: string;

  /**
   * @description 채널에 접속한 플레이어 목록
   */
  players: MemberInfo[];

  /**
   * @description 채널에 접속한 관전자 목록
   */
  oberservers: MemberInfo[];
}

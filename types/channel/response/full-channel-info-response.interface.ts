import { MemberInfo } from '../socket';

export interface FullChannelInfoResponse {
  players: MemberInfo[];
  observers: MemberInfo[];
  isInGame: boolean;
}

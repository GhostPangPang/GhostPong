import { MemberInfo } from '../socket';

export interface ChannelMemberInfoResponse {
  players: MemberInfo[];
  observers: MemberInfo[];
}

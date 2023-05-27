import { MemberInfo } from '../socket';
import { ChannelMode } from './channels-list-response.interface';

export interface FullChannelInfoResponse {
  players: MemberInfo[];
  observers: MemberInfo[];
  isInGame: boolean;
  name: string;
  mode: ChannelMode;
}

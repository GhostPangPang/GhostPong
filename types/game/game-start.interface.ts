import { MemberInfo } from '../channel';

export interface GameStart {
  gameId: string;
  leftPlayer: MemberInfo;
  rightPlayer: MemberInfo;
}

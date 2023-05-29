import { MemberInfo } from '../../channel';
import { GameMode } from '../request';

export interface GameStart {
  gameId: string;
  mode: GameMode;
  leftPlayer: MemberInfo;
  rightPlayer: MemberInfo;
}

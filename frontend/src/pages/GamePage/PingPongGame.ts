import { Ball, Player, GameData, BAR_PADDING, CANVASE_WIDTH, BAR_WIDTH } from '@/game/game-data';

// object 로 할지 class 로 할지 고민
export class PingPongGame {
  status: 'ready' | 'playing' | 'end' = 'ready';
  // result: number; // result 같은거를 만들 수 있을 듯
  id: string;
  ball: Ball;
  leftPlayer: Player;
  rightPlayer: Player;

  constructor(channelId: string, leftPlayerId: number, rightPlayerId: number) {
    this.id = channelId;
    this.ball = new Ball();
    this.leftPlayer = new Player(leftPlayerId, BAR_PADDING);
    this.rightPlayer = new Player(rightPlayerId, CANVASE_WIDTH - BAR_PADDING - BAR_WIDTH);
  }

  updateData(data: GameData) {
    this.ball = data.ball;
    this.leftPlayer = data.leftPlayer;
    this.rightPlayer = data.rightPlayer;
  }
}

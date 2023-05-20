const BAR_HEIGHT = 0.1;
const BAR_WIDTH = 0.01;
const BAR_PADDING = 0.01;

const CANVASE_WIDTH = 1;
const CANVASE_HEIGHT = 0.5;

const BALL_RADIUS = 0.02;

class Ball {
  constructor(vx: number, vy: number) {
    this.x = CANVASE_WIDTH / 2;
    this.y = CANVASE_HEIGHT / 2;
    this.vx = vx;
    this.vy = vy;
    this.radius = BALL_RADIUS;
  }

  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

class Bar {
  constructor(x: number) {
    this.x = x;
    this.y = CANVASE_WIDTH / 2;
    this.width = BAR_WIDTH;
    this.height = BAR_HEIGHT;
  }
  x: number;
  y: number;
  width: number;
  height: number;
}

class Player {
  constructor(userId: number, bar: Bar) {
    this.userId = userId;
    this.score = 0;
    this.bar = bar;
  }
  userId: number;
  score: number;
  bar: Bar;
}

export class Game {
  constructor(id: string, leftUserId: number, rightUserId: number) {
    this.id = id;
    // TODO : randomize ball's velocity
    this.ball = new Ball(0.01, 0.01);
    this.leftPlayer = new Player(leftUserId, new Bar(BAR_PADDING));
    this.rightPlayer = new Player(rightUserId, new Bar(CANVASE_WIDTH - BAR_PADDING));
  }

  id: string;
  ball: Ball;
  leftPlayer: Player;
  rightPlayer: Player;
}

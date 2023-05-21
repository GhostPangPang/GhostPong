export const BAR_HEIGHT = 10;
export const BAR_WIDTH = 1;
export const BAR_PADDING = 1;

export const CANVASE_WIDTH = 100;
export const CANVASE_HEIGHT = 50;

export const BALL_RADIUS = 2;
export const BALL_INITIAL_SPEED = 2;

export const DEGREE = Math.PI / 4; // 45도

export class Ball {
  constructor() {
    this.x = CANVASE_WIDTH / 2;
    this.y = CANVASE_HEIGHT / 2;
    const angle = Math.random() * DEGREE;
    this.vx = Math.round(Math.cos(angle) * BALL_INITIAL_SPEED * (Math.random() > 0.5 ? 1 : -1) * 100) / 100;
    this.vy = Math.round(Math.sin(angle) * BALL_INITIAL_SPEED * 100) / 100;
    this.speed = BALL_INITIAL_SPEED;
    this.radius = BALL_RADIUS;
  }
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  radius: number;
}

export class Player {
  constructor(userId: number, x: number) {
    this.userId = userId;
    this.score = 0;
    this.x = x;
    this.y = CANVASE_WIDTH / 2;
    this.width = BAR_WIDTH;
    this.height = BAR_HEIGHT;
  }

  userId: number;
  score: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export class Game {
  constructor(id: string, leftUserId: number, rightUserId: number) {
    this.id = id;
    this.ball = new Ball();
    this.leftPlayer = new Player(leftUserId, BAR_PADDING);
    this.rightPlayer = new Player(rightUserId, CANVASE_WIDTH - BAR_PADDING);
  }

  id: string;
  ball: Ball;
  leftPlayer: Player;
  rightPlayer: Player;
  intervalId?: number;
}

import { GameMode } from '../types/game';

export const BAR_NORMAL_HEIGHT = 10;
export const BAR_STUPID_HEIGHT = 5;
export const BAR_WIDTH = 1;
export const BAR_PADDING = 3;

export const CANVASE_WIDTH = 100;
export const CANVASE_HEIGHT = 50;

export const BALL_NORMAL_RADIUS = 1;
export const BALL_STUPID_RADIUS = 5;
export const BALL_NORMAL_SPEED = 0.5;
export const BALL_BOOST_SPEED = 1;
export const BALL_ACCERELATION = 0.05;

export const DEGREE = Math.PI / 4; // 45도

export class Ball {
  constructor(mode: GameMode) {
    this.x = CANVASE_WIDTH / 2;
    this.y = CANVASE_HEIGHT / 2;
    this.initialSpeed = mode === 'speed' ? BALL_BOOST_SPEED : BALL_NORMAL_SPEED;
    this.speed = this.initialSpeed;
    const angle = Math.random() * DEGREE;
    this.vx = Math.round(Math.cos(angle) * this.initialSpeed * (Math.random() > 0.5 ? 1 : -1) * 100) / 100;
    this.vy = Math.round(Math.sin(angle) * this.initialSpeed * 100) / 100;
    this.radius = mode === 'stupid' ? BALL_STUPID_RADIUS : BALL_NORMAL_RADIUS;
  }
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  initialSpeed: number;
  radius: number;
}

export class Player {
  constructor(userId: number, x: number, mode: GameMode) {
    this.userId = userId;
    this.score = 0;
    this.x = x;
    this.y = CANVASE_HEIGHT / 2;
    this.width = BAR_WIDTH;
    this.height = mode === 'stupid' ? BAR_STUPID_HEIGHT : BAR_NORMAL_HEIGHT;
  }

  userId: number;
  score: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export class GameData {
  constructor(id: string, mode: GameMode, leftUserId: number, rightUserId: number) {
    this.id = id;
    this.mode = mode;
    this.ball = new Ball(mode);
    this.leftPlayer = new Player(leftUserId, BAR_PADDING, mode);
    this.rightPlayer = new Player(rightUserId, CANVASE_WIDTH - BAR_PADDING, mode);
  }

  id: string;
  mode: GameMode;
  ball: Ball;
  leftPlayer: Player;
  rightPlayer: Player;
}

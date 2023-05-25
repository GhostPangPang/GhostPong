import {
  BALL_ACCERELATION,
  BALL_INITIAL_SPEED,
  CANVASE_HEIGHT,
  CANVASE_WIDTH,
  DEGREE,
  GameData,
  BAR_WIDTH,
  Ball,
  Player,
} from './game-data';

export function resetBallData(ball: Ball) {
  ball.x = CANVASE_WIDTH / 2;
  ball.y = CANVASE_HEIGHT / 2;
  const angle = Math.random() * DEGREE;
  ball.vx = Math.round(Math.cos(angle) * BALL_INITIAL_SPEED * (Math.random() > 0.5 ? 1 : -1) * 100) / 100;
  ball.vy = Math.round(Math.sin(angle) * BALL_INITIAL_SPEED * 100) / 100;
  ball.speed = BALL_INITIAL_SPEED;
}

/**
 * 공이 player 의 bar 와 부딪힌 위치에 따라 공의 방향을 다르게 바꾼다.
 *
 * @param ball
 * @param player
 * @param direction
 */
export function modifyBallDirection(ball: Ball, player: Player, direction: 1 | -1) {
  const collidePoint = (player.y - ball.y) / (player.height / 2);
  const angle = DEGREE * collidePoint;
  // canvas 의 왼쪽이면 leftPlayer 의 바에 맞았으므로 direction 을 양수로 전환하고 오른쪽이면 rightPlayer 의 바에 맞았으므로 음수로 전환한다.
  ball.vx = Math.round(Math.cos(angle) * ball.speed * direction * 100) / 100;
  // 바 위쪽에 맞으면 음수, 바 아래쪽에 맞으면 양수
  ball.vy = Math.round(Math.sin(angle) * ball.speed * 100) / 100;
  ball.speed += BALL_ACCERELATION;
}

/**
 * player 의 bar 와 공이 부딪혔는지 확인하고 부딪혔다면 공의 방향을 바꾼다.
 *
 * @param game
 */
export function checkPlayerCollision(game: GameData): boolean {
  if (game.ball.x < CANVASE_WIDTH / 2) {
    const player = game.leftPlayer;
    if (
      game.ball.x - game.ball.radius < player.x + BAR_WIDTH &&
      game.ball.y < player.y + player.height / 2 &&
      game.ball.y > player.y - player.height / 2
    ) {
      modifyBallDirection(game.ball, player, 1);
      return true;
    }
  } else {
    const player = game.rightPlayer;
    if (
      game.ball.x + game.ball.radius > player.x &&
      game.ball.y < player.y + player.height / 2 &&
      game.ball.y > player.y - player.height / 2
    ) {
      modifyBallDirection(game.ball, player, -1);
      return true;
    }
  }
  return false;
}

/**
 * 위, 아래 벽과 부딪혔는지 확인하고 공의 y 방향을 반대로 전환한다.
 *
 * @param ball
 */
export function checkWallCollision(ball: Ball) {
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > CANVASE_HEIGHT) {
    ball.vy *= -1;
  }
}

/**
 * player side 의 벽과 부딪혔는지 확인하고 score 를 업데이트 한다.
 *
 * @param game
 */
export function checkGameEnded(game: GameData): boolean {
  if (game.ball.x - game.ball.radius < 0) {
    game.rightPlayer.score += 1;
    resetBallData(game.ball);
    return true;
  }
  if (game.ball.x + game.ball.radius > CANVASE_WIDTH) {
    game.leftPlayer.score += 1;
    resetBallData(game.ball);
    return true;
  }
  return false;
}

/**
 * 공의 위치를 업데이트 한다.
 *
 * @param game
 */
export function updateBall(game: GameData) {
  game.ball.x += game.ball.vx;
  game.ball.y += game.ball.vy;
}

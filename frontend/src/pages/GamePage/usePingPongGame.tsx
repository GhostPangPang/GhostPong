import theme from '@/assets/styles/theme';
import { drawArc, drawRect, drawText } from '@/libs/utils/canvas';
import { canvasSizeState, canvasRatioState } from '@/stores/gameState';
import { useRecoilState, useRecoilValue } from 'recoil';
import { updateBall, checkPlayerCollision, checkWallCollision, checkGameEnded } from '@/game/utils';
import { MemberType } from './GamePage';
import { PingPongGame } from './PingPongGame';
import { useEffect } from 'react';
import { emitEvent, onEvent } from '@/libs/api';
import { GameEvent } from '@/constants';

const NET_WIDTH = 1;
const NET_HEIGHT = 3;

const BAR_RADIUS = 5;

export interface PingPongGameConfig {
  channelId: string;
  leftPlayerId: number;
  rightPlayerId: number;
}

export const usePingPongGame = ({ channelId, leftPlayerId, rightPlayerId }: PingPongGameConfig) => {
  const gameData = new PingPongGame(channelId, leftPlayerId, rightPlayerId);

  const [canvasSize, setCanvasSize] = useRecoilState(canvasSizeState);
  const canvasRatio = useRecoilValue(canvasRatioState);

  const { leftPlayer, rightPlayer, ball } = gameData;
  const { width, height } = canvasSize;
  const { ratio } = canvasRatio;

  useEffect(() => {
    // update game data
    onEvent(GameEvent.GAMEDATA, gameData.updateData);
    onEvent(GameEvent.GAMEEND, gameData.updateData);
  }, []);

  // main draw function
  const draw = (context: CanvasRenderingContext2D) => {
    if (!context || !width || !height) return;

    // clear the canvas
    drawRect(context, 0, 0, width, height, theme.color.gray500);

    // draw user1 score to the left
    drawText(context, '1', width / 4, height / 5, theme.color.gray100);

    // draw user2 score to the right
    drawText(context, '2', (3 * width) / 4, height / 5, theme.color.gray100);

    // draw net
    drawNet(context);

    // draw the ball
    drawArc(context, ball.x * ratio, ball.y * ratio, ball.radius * ratio, theme.color.secondary);

    // draw leftPlayer paddle
    drawBar(
      context,
      leftPlayer.x * ratio,
      leftPlayer.y * ratio - (leftPlayer.height / 2) * ratio,
      leftPlayer.width * ratio,
      leftPlayer.height * ratio,
      theme.color.primary,
    );

    // draw rightPlayer paddle
    drawBar(
      context,
      rightPlayer.x * ratio,
      rightPlayer.y * ratio - (rightPlayer.height / 2) * ratio,
      rightPlayer.width * ratio,
      rightPlayer.height * ratio,
    );
  };

  const drawCountDown = (context: CanvasRenderingContext2D, width: number, height: number) => {
    drawRect(context, 0, 0, width, height, theme.color.gray500);
    drawText(context, '3', width / 2, height / 2, theme.color.secondary, 48);

    setTimeout(() => {
      drawRect(context, 0, 0, width, height, theme.color.gray500);
      drawText(context, '2', width / 2, height / 2, theme.color.secondary, 48);
    }, 1000);

    setTimeout(() => {
      drawRect(context, 0, 0, width, height, theme.color.gray500);
      drawText(context, '1', width / 2, height / 2, theme.color.secondary, 48);
    }, 2000);

    setTimeout(() => {
      drawRect(context, 0, 0, width, height, theme.color.gray500);
      drawText(context, 'GO!', width / 2, height / 2, theme.color.foreground, 48);
    }, 3000);
  };

  const drawNet = (context: CanvasRenderingContext2D) => {
    const x = width / 2 - 1;
    const y = 1;
    for (let i = y; i < height; i += 3) {
      drawRect(context, x, y + i * NET_HEIGHT, NET_WIDTH, NET_HEIGHT, theme.color.gray150);
    }
  };

  const drawBar = (context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color?: string) => {
    context.fillStyle = color ?? theme.color.gray100;
    context.beginPath();
    context.roundRect(x, y, w, h, BAR_RADIUS);
    context.fill();
  };

  const moveBar = (playerType: MemberType, y: number) => {
    if (playerType === 'leftPlayer') {
      const normalY = y / ratio - leftPlayer.height / 2;
      leftPlayer.y = normalY;
      emitEvent(GameEvent.MOVEBAR, { gameId: channelId, y: normalY });
    } else if (playerType === 'rightPlayer') {
      const normalY = y / ratio - rightPlayer.height / 2;
      rightPlayer.y = normalY;
      emitEvent(GameEvent.MOVEBAR, { gameId: channelId, y: normalY });
    }
  };

  const update = () => {
    updateBall(gameData);
    checkPlayerCollision(gameData);
    checkWallCollision(gameData.ball);
    checkGameEnded(gameData);
  };

  const playGame = (context: CanvasRenderingContext2D) => {
    draw(context);
    update();
  };

  return { setCanvasSize, playGame, moveBar, drawCountDown };
};

import theme from '@/assets/styles/theme';
import { drawArc, drawRect, drawText } from '@/libs/utils/canvas';
import {
  canvasSizeState,
  canvasRatioState,
  gamePlayerState,
  gameIdState,
  gameDataState,
  gameStatusState,
  gameResultState,
} from '@/stores/gameState';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { updateBall, checkPlayerCollision, checkWallCollision, checkGameEnded } from '@/game/utils';
import { MemberType } from './GamePage';
import { useEffect } from 'react';
import { emitEvent, offEvent, onEvent } from '@/libs/api';
import { GameEvent } from '@/constants';
import { Player, GameData, BAR_PADDING, BAR_WIDTH, CANVASE_WIDTH } from '@/game/game-data';
import { GameEnd, BarMoved } from '@/dto/game';

import wallSound from '@/assets/sounds/wall.mp3';
import hitSound from '@/assets/sounds/hit.mp3';
import endSound from '@/assets/sounds/end.mp3';
import { useSound } from '@/hooks';

const NET_WIDTH = 1;
const NET_HEIGHT = 3;

const BAR_RADIUS = 5;

export interface PingPongGameConfig {
  channelId: string;
  leftPlayerId: number;
  rightPlayerId: number;
}

export interface GameHook {
  draw: (context: CanvasRenderingContext2D) => void;
  updateGame: () => void;
  playGame: () => void;
}

export const usePingPongGame = () => {
  // recoil game states
  const gameId = useRecoilValue(gameIdState);
  const gamePlayer = useRecoilValue(gamePlayerState);

  const [gameStatus, setGameStatus] = useRecoilState(gameStatusState);
  const [gameData, setGameData] = useRecoilState(gameDataState);
  const [gameResult, setGameResult] = useRecoilState(gameResultState);
  const [canvasSize, setCanvasSize] = useRecoilState(canvasSizeState);
  const canvasRatio = useRecoilValue(canvasRatioState);

  // sounds
  const playWallSound = useSound(wallSound);
  const playHitSound = useSound(hitSound);
  const playEndSound = useSound(endSound);

  // recoil reset
  const resetGameId = useResetRecoilState(gameIdState);
  const resetGamePlayer = useResetRecoilState(gamePlayerState);
  const resetGameData = useResetRecoilState(gameDataState);
  const resetCanvasSize = useResetRecoilState(canvasSizeState);
  const resetCanvasRatio = useResetRecoilState(canvasRatioState);

  // variables
  const { mode, leftPlayer, rightPlayer, ball } = gameData;
  const { width, height } = canvasSize;
  const { ratio } = canvasRatio;

  useEffect(() => {
    if (!gameId || !gamePlayer.leftPlayer || !gamePlayer.rightPlayer) {
      console.log('게임을 제대로 시작할 수 없습니다.');
      return;
    }

    // init game data
    const { leftPlayer: leftUser, rightPlayer: rightUser } = gamePlayer;

    setGameData((prev) => ({
      ...prev,
      id: gameId,
      mode: 'normal',
      leftPlayer: new Player(leftUser?.userId ?? 1, BAR_PADDING, 'normal'),
      rightPlayer: new Player(rightUser?.userId ?? 2, CANVASE_WIDTH - BAR_PADDING - BAR_WIDTH, 'normal'), // width 신경쓰기
    }));

    // gameStatus 바꾸기
    setTimeout(() => {
      setGameStatus('playing');
    }, 1000);

    // game data event
    onEvent(GameEvent.GAMEDATA, (data: GameData) => {
      setGameData(data); // 밑에 애랑 성능비교해보기
      // setGameData((prev) => ({ ...prev, ...data }));
    });

    // game bar moved
    onEvent(GameEvent.MOVEBAR, (data: BarMoved) => {
      const { userId, y } = data;

      if (userId === leftPlayer.userId) {
        setGameData((prev) => ({ ...prev, leftPlayer: { ...prev.leftPlayer, y } }));
      } else if (userId === rightPlayer.userId) {
        setGameData((prev) => ({ ...prev, rightPlayer: { ...prev.rightPlayer, y } }));
      }
    });

    // game end event
    onEvent(GameEvent.GAMEEND, (data: GameEnd) => {
      console.log('GAMEEND', data);
      playEndSound();
      setGameStatus('end');
      setGameResult(data);
    });

    emitEvent(GameEvent.PLAYERREADY, { gameId });

    // cleanup
    return () => {
      console.log('usePingPong cleanup');
      resetGameId();
      resetGamePlayer();
      resetGameData();
      resetCanvasSize();
      resetCanvasRatio();
      offEvent(GameEvent.GAMEDATA);
      offEvent(GameEvent.MOVEBAR);
      offEvent(GameEvent.GAMEEND);
    };
  }, []);

  // main draw function
  const draw = (context: CanvasRenderingContext2D) => {
    if (!context || !width || !height) return;

    // clear the canvas
    // drawRect(context, 0, 0, width, height, theme.color.gray500);
    context.clearRect(0, 0, width, height);

    if (gameStatus === 'end') return; // 이 로직도 확인해보기

    // draw user1 score to the left
    drawText(context, leftPlayer.score.toString(), width / 4, height / 5, theme.color.gray100);

    // draw user2 score to the right
    drawText(context, rightPlayer.score.toString(), (3 * width) / 4, height / 5, theme.color.gray100);

    // draw net
    drawNet(context);

    // draw the ball
    drawBall(context);
    // drawArc(context, ball.x * ratio, ball.y * ratio, ball.radius * ratio, theme.color.secondary);

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

  const drawCountDown = (context: CanvasRenderingContext2D) => {
    drawRect(context, 0, 0, width, height, theme.color.gray500);
    drawText(context, 'GO!', width / 2, height / 2, theme.color.foreground, 48);
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

  const drawBall = (context: CanvasRenderingContext2D) => {
    // wall sound
    // if (
    //   ball.x - ball.radius < 0 ||
    //   ball.x + ball.radius > width ||
    //   ball.y - ball.radius < 0 ||
    //   ball.y + ball.radius > height
    // ) {
    //   playWallSound();
    // }
    // // hit sound
    // if (
    //   (ball.x + ball.radius > rightPlayer.x &&
    //     ball.y < rightPlayer.y + rightPlayer.height / 2 &&
    //     ball.y > rightPlayer.y - rightPlayer.height / 2) ||
    //   (ball.x - ball.radius < leftPlayer.x + BAR_WIDTH &&
    //     ball.y < leftPlayer.y + leftPlayer.height / 2 &&
    //     ball.y > leftPlayer.y - leftPlayer.height / 2)
    // ) {
    //   playHitSound();
    // }
    drawArc(context, ball.x * ratio, ball.y * ratio, ball.radius * ratio, theme.color.secondary);
  };

  const moveBar = (playerType: MemberType, y: number) => {
    if (playerType === 'leftPlayer') {
      const normalY = y / ratio - leftPlayer.height / 2;
      // leftPlayer.y = normalY;
      setGameData((prev) => ({ ...prev, leftPlayer: { ...prev.leftPlayer, y: normalY } }));
      emitEvent(GameEvent.MOVEBAR, { gameId, y: normalY });
    } else if (playerType === 'rightPlayer') {
      const normalY = y / ratio - rightPlayer.height / 2;
      // rightPlayer.y = normalY;
      setGameData((prev) => ({ ...prev, rightPlayer: { ...prev.rightPlayer, y: normalY } }));
      emitEvent(GameEvent.MOVEBAR, { gameId, y: normalY });
    }
  };

  const updateGame = () => {
    const updateData: GameData = {
      id: gameId,
      mode: mode,
      leftPlayer: { ...leftPlayer },
      rightPlayer: { ...rightPlayer },
      ball: { ...ball },
    };
    updateBall(updateData);
    // checkPlayerCollision(updateData);
    checkWallCollision(updateData.ball);
    // checkGameEnded(updateData);
    setGameData(updateData);
  };

  const playGame = (context: CanvasRenderingContext2D) => {
    draw(context);
    updateGame();
  };

  return { gameStatus, setCanvasSize, playGame, moveBar, drawCountDown };
};

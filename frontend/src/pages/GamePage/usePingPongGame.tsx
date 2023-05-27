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
  ballState,
  leftPlayerState,
  rightPlayerState,
  gameModeState,
} from '@/stores/gameState';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { updateBall, checkWallCollision } from '@/game/utils';
import { MemberType } from './GamePage';
import { useEffect } from 'react';
import { emitEvent, offEvent, onEvent } from '@/libs/api';
import { GameEvent } from '@/constants';
import { Player, Ball, GameData, BAR_PADDING, BAR_WIDTH, CANVASE_WIDTH } from '@/game/game-data';
import { GameEnd, BarMoved } from '@/dto/game';

import wallSound from '@/assets/sounds/wall.mp3';
import hitSound from '@/assets/sounds/hit.mp3';
import endSound from '@/assets/sounds/end.mp3';
import { debounce } from '@/libs/utils/debounce';
import { AudioManager } from '@/libs/utils/sound';

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
  const gameMode = useRecoilValue(gameModeState);
  const gamePlayer = useRecoilValue(gamePlayerState);

  const [gameStatus, setGameStatus] = useRecoilState(gameStatusState);
  const [gameData, setGameData] = useRecoilState(gameDataState);
  const [ball, setBall] = useRecoilState(ballState);
  const [leftPlayer, setLeftPlayer] = useRecoilState(leftPlayerState);
  const [rightPlayer, setRightPlayer] = useRecoilState(rightPlayerState);

  const [gameResult, setGameResult] = useRecoilState(gameResultState);
  const [canvasSize, setCanvasSize] = useRecoilState(canvasSizeState);
  const canvasRatio = useRecoilValue(canvasRatioState);

  // sounds
  const playWallSound = AudioManager.getInstance(wallSound);
  const playHitSound = AudioManager.getInstance(hitSound);
  const playEndSound = AudioManager.getInstance(endSound);

  // recoil reset
  const resetGameId = useResetRecoilState(gameIdState);
  const resetGamePlayer = useResetRecoilState(gamePlayerState);
  const resetGameData = useResetRecoilState(gameDataState);
  const resetCanvasSize = useResetRecoilState(canvasSizeState);
  const resetCanvasRatio = useResetRecoilState(canvasRatioState);

  // variables
  const { width, height } = canvasSize;
  const { ratio } = canvasRatio;

  useEffect(() => {
    if (!gameId || !gamePlayer.leftPlayer || !gamePlayer.rightPlayer) {
      console.log('게임을 제대로 시작할 수 없습니다.');
      return;
    }

    // init game date
    const { leftPlayer: leftUser, rightPlayer: rightUser } = gamePlayer;

    setGameData((prev) => ({
      ...prev,
      id: gameId,
      mode: gameMode,
      ball: new Ball(gameMode),
      leftPlayer: new Player(leftUser.userId, BAR_PADDING, gameMode),
      rightPlayer: new Player(rightUser.userId, CANVASE_WIDTH - BAR_PADDING - BAR_WIDTH, gameMode), // width 신경쓰기
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
    onEvent(GameEvent.BARMOVED, (data: BarMoved) => {
      const { userId, y } = data;

      if (userId === leftPlayer.userId) {
        // setGameData((prev) => ({ ...prev, leftPlayer: { ...prev.leftPlayer, y } }));
        setLeftPlayer((prev) => ({ ...prev, y }));
      } else if (userId === rightPlayer.userId) {
        // setGameData((prev) => ({ ...prev, rightPlayer: { ...prev.rightPlayer, y } }));
        setRightPlayer((prev) => ({ ...prev, y }));
      }
    });

    // game end event
    onEvent(GameEvent.GAMEEND, (data: GameEnd) => {
      console.log('GAMEEND', data);
      playEndSound.play();
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
      offEvent(GameEvent.BARMOVED);
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
    // drawBall(context);
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

  const moveBarEvent = debounce((y: number) => {
    emitEvent(GameEvent.MOVEBAR, { gameId, y });
  }, 500);

  const moveBar = debounce((playerType: MemberType, y: number) => {
    let normalY: number;
    if (playerType === 'leftPlayer') {
      normalY = y / ratio - leftPlayer.height / 2;
      setLeftPlayer((prev) => ({ ...prev, y: normalY }));
      moveBarEvent(normalY);
    } else if (playerType === 'rightPlayer') {
      normalY = y / ratio - rightPlayer.height / 2;
      setRightPlayer((prev) => ({ ...prev, y: normalY }));
      moveBarEvent(normalY);
    }
  }, 500);

  const updateGame = () => {
    const updateData: GameData = {
      id: gameId,
      mode: gameMode,
      leftPlayer: { ...leftPlayer },
      rightPlayer: { ...rightPlayer },
      ball: { ...ball },
    };
    updateBall(updateData);
    checkWallCollision(updateData.ball);

    // play sound
    if (updateData.ball.vy * ball.vy < 0) {
      if (updateData.ball.vx * ball.vx < 0) playHitSound.play();
      else playWallSound.play();
    }
    setGameData(updateData);
  };

  const playGame = (context: CanvasRenderingContext2D) => {
    draw(context);
    updateGame(); //이게 계속 되는듯
  };

  return { gamePlayer, gameResult, gameStatus, setCanvasSize, playGame, moveBar, drawCountDown };
};

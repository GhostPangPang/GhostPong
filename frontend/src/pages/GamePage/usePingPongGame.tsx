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
  gameMemberTypeState,
} from '@/stores/gameState';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { updateBall, checkWallCollision } from '@/game/utils';
import { useEffect } from 'react';
import { emitEvent, offEvent, onEvent } from '@/libs/api';
import { GameEvent } from '@/constants';
import { Player, Ball, GameData, BAR_PADDING, BAR_WIDTH, CANVASE_WIDTH } from '@/game/game-data';
import { GameEnd, BarMoved } from '@/dto/game';

import { debounce } from '@/libs/utils/debounce';

const NET_WIDTH = 1;
const NET_HEIGHT = 3;

const BAR_RADIUS = 5;

export interface PingPongGameConfig {
  channelId: string;
  leftPlayerId: number;
  rightPlayerId: number;
}

export const usePingPongGame = () => {
  // recoil game states
  const gameId = useRecoilValue(gameIdState);
  const gameMode = useRecoilValue(gameModeState);
  const gamePlayer = useRecoilValue(gamePlayerState);

  const [gameStatus, setGameStatus] = useRecoilState(gameStatusState);
  const [gameMemberType, setGameMemberType] = useRecoilState(gameMemberTypeState);
  const [gameData, setGameData] = useRecoilState(gameDataState);
  const [ball, setBall] = useRecoilState(ballState);
  const [leftPlayer, setLeftPlayer] = useRecoilState(leftPlayerState);
  const [rightPlayer, setRightPlayer] = useRecoilState(rightPlayerState);

  const [gameResult, setGameResult] = useRecoilState(gameResultState);
  const [canvasSize, setCanvasSize] = useRecoilState(canvasSizeState);
  const canvasRatio = useRecoilValue(canvasRatioState);

  // recoil reset
  const resetGameId = useResetRecoilState(gameIdState);
  const resetGameData = useResetRecoilState(gameDataState);
  const resetGameMode = useResetRecoilState(gameModeState);
  const resetGameStatus = useResetRecoilState(gameStatusState);
  const resetCanvasSize = useResetRecoilState(canvasSizeState);
  const resetCanvasRatio = useResetRecoilState(canvasRatioState);

  // variables
  const { width, height } = canvasSize;
  const { ratio } = canvasRatio;

  useEffect(() => {
    // init game date
    if (!gameId || !gamePlayer.leftPlayer || !gamePlayer.rightPlayer) {
      console.log('게임을 제대로 시작할 수 없습니다.');
      return;
    }

    const { leftPlayer: leftUser, rightPlayer: rightUser } = gamePlayer;

    setGameData((prev) => ({
      ...prev,
      id: gameId,
      mode: gameMode,
      ball: new Ball(gameMode),
      leftPlayer: new Player(leftUser.userId, BAR_PADDING, gameMode),
      rightPlayer: new Player(rightUser.userId, CANVASE_WIDTH - BAR_PADDING - BAR_WIDTH, gameMode), // width 신경쓰기
    }));

    // game data event
    onEvent(GameEvent.GAMEDATA, (data: GameData) => {
      setGameData(data); // 밑에 애랑 성능비교해보기
      // setGameData((prev) => ({ ...prev, ...data }));
    });

    // game bar moved
    onEvent(GameEvent.BARMOVED, (data: BarMoved) => {
      const { userId, y } = data;
      if (gameMemberType !== 'leftPlayer' && userId === leftPlayer.userId) {
        setLeftPlayer((prev) => ({ ...prev, y }));
      } else if (gameMemberType !== 'rightPlayer' && userId === rightPlayer.userId) {
        setRightPlayer((prev) => ({ ...prev, y }));
      }
    });

    // game end event
    onEvent(GameEvent.GAMEEND, (data: GameEnd) => {
      console.log('GAMEEND', data);
      setGameStatus('end');
      setGameResult(data);
    });

    emitEvent(GameEvent.PLAYERREADY, { gameId });

    // cleanup
    return () => {
      console.log('usePingPong cleanup');
      resetGameId();
      resetGameData();
      resetGameMode();
      resetGameStatus();
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
  }, 10);

  const moveBar = (y: number) => {
    let normalY: number;
    if (gameMemberType === 'leftPlayer') {
      const barHeight = leftPlayer.height / 2;
      normalY = y / ratio - barHeight;
      if (normalY < barHeight) normalY = barHeight;
      setLeftPlayer((prev) => ({ ...prev, y: normalY }));
      moveBarEvent(normalY);
    } else if (gameMemberType === 'rightPlayer') {
      const barHeight = rightPlayer.height / 2;
      normalY = y / ratio - barHeight;
      if (normalY < barHeight) normalY = barHeight;
      setRightPlayer((prev) => ({ ...prev, y: normalY }));
      moveBarEvent(normalY);
    }
  };

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
    setGameData(updateData);
  };

  const playGame = (context: CanvasRenderingContext2D) => {
    draw(context);
    updateGame(); //이게 계속 되는듯
  };

  return { gamePlayer, gameResult, gameStatus, setCanvasSize, playGame, moveBar, drawCountDown };
};

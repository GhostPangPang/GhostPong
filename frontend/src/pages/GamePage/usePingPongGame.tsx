import theme from '@/assets/styles/theme';
import { drawArc, drawRect, drawText } from '@/libs/utils/canvas';
import {
  canvasSizeState,
  canvasRatioState,
  gamePlayerState,
  gameIdState,
  gameDataState,
  gameStatusState,
} from '@/stores/gameState';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { updateBall, checkPlayerCollision, checkWallCollision, checkGameEnded } from '@/game/utils';
import { MemberType } from './GamePage';
import { useEffect } from 'react';
import { emitEvent, offEvent, onEvent } from '@/libs/api';
import { GameEvent } from '@/constants';
import { Player, GameData, BAR_PADDING, BAR_WIDTH, CANVASE_WIDTH } from '@/game/game-data';
import { GameEnd } from '@/dto/game';

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
  const [canvasSize, setCanvasSize] = useRecoilState(canvasSizeState);
  const canvasRatio = useRecoilValue(canvasRatioState);

  // recoil reset
  const resetGameId = useResetRecoilState(gameIdState);
  const resetGamePlayer = useResetRecoilState(gamePlayerState);
  const resetGameData = useResetRecoilState(gameDataState);
  const resetCanvasSize = useResetRecoilState(canvasSizeState);
  const resetCanvasRatio = useResetRecoilState(canvasRatioState);

  // variables
  const { leftPlayer, rightPlayer, ball } = gameData;
  const { width, height } = canvasSize;
  const { ratio } = canvasRatio;

  useEffect(() => {
    if (!gameId || !gamePlayer.leftPlayer || !gamePlayer.rightPlayer) {
      console.log('게임을 제대로 시작할 수 없습니다.');
      return;
    } // error 메세지 생각해보기 이거 소켓 연결하면 실행하기

    // init game data
    const { leftPlayer: leftUser, rightPlayer: rightUser } = gamePlayer;

    setGameData((prev) => ({
      ...prev,
      id: gameId,
      leftPlayer: new Player(leftUser?.userId ?? 1, BAR_PADDING),
      rightPlayer: new Player(rightUser?.userId ?? 2, CANVASE_WIDTH - BAR_PADDING - BAR_WIDTH), // width 신경쓰기
    }));

    // gameStatus 바꾸기
    setTimeout(() => {
      setGameStatus('playing');
    }, 1000);

    // update game data
    onEvent(GameEvent.GAMEDATA, (data: GameData) => {
      // setGameData(data); // 얘 되는지 확인하기
      setGameData((prev) => ({ ...prev, ...data }));
    });
    onEvent(GameEvent.GAMEEND, (data: GameEnd) => {
      console.log('GAMEEND', data);
      setGameStatus('end');
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
      // offEvent(GameEvent.GAMEEND);
    };
  }, []);

  // main draw function
  const draw = (context: CanvasRenderingContext2D) => {
    if (!context || !width || !height) return;

    // clear the canvas
    drawRect(context, 0, 0, width, height, theme.color.gray500);

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
      leftPlayer: { ...leftPlayer },
      rightPlayer: { ...rightPlayer },
      ball: { ...ball },
    };
    // setGameData((prev) => {
    //   updateBall(prev);
    //   checkPlayerCollision(prev);
    //   checkWallCollision(prev.ball);
    //   checkGameEnded(prev);
    //   return prev;
    // });
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

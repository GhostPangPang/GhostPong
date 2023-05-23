import { Ball, Player, GameData } from '@/game/game-data';
import { DefaultValue, atom, selector } from 'recoil';

const UNIT = 100;

export type CanvasRatio = {
  normalW: number;
  normalH: number;
  ratio: number;
};

export const canvasRatioState = atom<CanvasRatio>({
  key: 'canvasRatioState',
  default: {
    normalW: 0,
    normalH: 0,
    ratio: 1,
  },
});

export const canvasSizeState = selector<{ width: number; height: number }>({
  key: 'canvasSizeSelect',
  get: ({ get }) => {
    const canvas = get(canvasRatioState);
    const { normalW, normalH, ratio } = canvas;
    console.log('canvasSizeState', normalW, normalH);

    return {
      width: normalW * ratio,
      height: normalH * ratio,
    };
  },
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) return;
    const { width, height } = newValue;
    const ratio = Math.max(width, height) / UNIT;
    set(canvasRatioState, {
      normalW: width / ratio,
      normalH: height / ratio,
      ratio,
    });
  },
});

export const ballState = atom<Ball>({
  key: 'ballState',
  default: new Ball(),
});

export const leftPlayerState = atom<Player>({
  key: 'leftPlayerState',
  default: new Player(1, 1),
});

export const rightPlayerState = atom<Player>({
  key: 'rightPlayerState',
  default: new Player(2, 99),
});

// game socket event 받고 나서 gameState 업데이트
export const gameDataState = atom<GameData>({
  key: 'gameState',
  default: {
    id: '',
    ball: new Ball(),
    leftPlayer: new Player(1, 1),
    rightPlayer: new Player(2, 99),
  },
});

type Game = {
  status: 'ready' | 'playing' | 'end';
  // result: ;
  gameData: GameData;
};

// export const gameState =

// export const gameState = selector<Game>({
//   key: 'gameState',
//   get: ({ get }) => {
//     const { width_ratio, height_ratio } = get(canvasState);
//     const { id, ball, leftPlayer, rightPlayer } = get(gameEventState);

//     return {
//       id,
//       ball: {}
//     };
//   },
// });

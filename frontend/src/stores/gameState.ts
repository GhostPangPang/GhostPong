import { MemberInfo } from '@/dto/channel/socket';
import { Ball, Player, GameData } from '@/game/game-data';
import { DefaultValue, atom, selector } from 'recoil';
import { GameEnd } from '@/dto/game/';

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
    ratio: 0,
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
  default: new Ball('normal'),
});

export const leftPlayerState = atom<Player>({
  key: 'leftPlayerState',
  default: new Player(1, 1, 'normal'),
});

export const rightPlayerState = atom<Player>({
  key: 'rightPlayerState',
  default: new Player(2, 99, 'normal'),
});

// game socket event 받고 나서 gameState 업데이트
export const gameDataState = atom<GameData>({
  key: 'gameState',
  default: {
    id: '',
    mode: 'normal',
    ball: new Ball('normal'),
    leftPlayer: new Player(0, 0, 'normal'),
    rightPlayer: new Player(0, 0, 'normal'),
  },
});

export const gameIdState = atom<string>({
  key: 'gameIdState',
  default: '',
});

// game player data
type GamePlayerData = {
  leftPlayer: MemberInfo | null;
  rightPlayer: MemberInfo | null;
};

export const gamePlayerState = atom<GamePlayerData>({
  key: 'gamePlayerState',
  default: {
    leftPlayer: null,
    rightPlayer: null,
  },
});

export type READY = 'ready';
export type PLAYING = 'playing';
export type END = 'end';

type GameStatus = READY | PLAYING | END;

type GameType = 'random' | 'normal';

export const gameTypeState = atom<GameType>({
  key: 'gameTypeState',
  default: 'normal',
});

export const gameStatusState = atom<GameStatus>({
  key: 'gameStatusState',
  default: 'ready',
});

export const gameResultState = atom<GameEnd>({
  key: 'gameResultState',
  default: {
    id: '',
    winner: {
      id: -1,
      score: 0,
    },
    loser: {
      id: -1,
      score: 0,
    },
  },
});

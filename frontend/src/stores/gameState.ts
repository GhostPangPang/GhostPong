import { MemberInfo } from '@/dto/channel/socket';
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
    leftPlayer: new Player(0, 0),
    rightPlayer: new Player(0, 0),
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

// 타입 일관성 없음 MemberInfo 인지 User 인지, MemberInfo 로 일단 구현
export const gamePlayerState = atom<GamePlayerData>({
  key: 'gamePlayerState',
  default: {
    leftPlayer: null,
    rightPlayer: null,
  },
});

type GameStatus = 'ready' | 'playing' | 'end';

export const gameStatusState = atom<GameStatus>({
  key: 'gameStatusState',
  default: 'ready',
});

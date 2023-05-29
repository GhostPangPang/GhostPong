import { MemberInfo } from '@/dto/channel/socket';
import { Ball, Player, GameData } from '@/game/game-data';
import { DefaultValue, atom, selector } from 'recoil';
import { GameEnd, GameMode } from '@/dto/game/';

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

export const gameIdState = atom<string>({
  key: 'gameIdState',
  default: '',
});

export type MemberType = 'leftPlayer' | 'rightPlayer' | 'observer';

export const gameMemberTypeState = atom<MemberType>({
  key: 'gameMemberType',
  default: 'observer',
});

export const gameModeState = atom<GameMode>({
  key: 'gameModeState',
  default: 'normal',
});

export const ballState = atom<Ball>({
  key: 'ballState',
  default: new Ball('normal'),
});

export const leftPlayerState = atom<Player>({
  key: 'leftPlayerState',
  default: new Player(0, 0, 'normal'),
});

export const rightPlayerState = atom<Player>({
  key: 'rightPlayerState',
  default: new Player(0, 0, 'normal'),
});

export const gameDataState = selector<GameData>({
  key: 'gameDataState',
  get: ({ get }) => {
    const gameId = get(gameIdState);
    const mode = get(gameModeState);
    const ball = get(ballState);
    const leftPlayer = get(leftPlayerState);
    const rightPlayer = get(rightPlayerState);

    return {
      id: gameId,
      mode,
      ball,
      leftPlayer,
      rightPlayer,
    };
  },
  set: ({ set, get }, newValue) => {
    if (newValue instanceof DefaultValue) return;
    const gameMemberType = get(gameMemberTypeState);
    const { id, mode, ball, leftPlayer, rightPlayer } = newValue;

    set(gameIdState, id);
    set(gameModeState, mode);
    set(ballState, ball);
    if (gameMemberType === 'leftPlayer')
      set(leftPlayerState, (prev) => ({
        ...prev,
        score: leftPlayer.score,
        width: leftPlayer.width,
        height: leftPlayer.height,
      }));
    else set(leftPlayerState, leftPlayer);
    if (gameMemberType === 'rightPlayer')
      set(rightPlayerState, (prev) => ({
        ...prev,
        score: rightPlayer.score,
        width: rightPlayer.width,
        height: rightPlayer.height,
      }));
    else set(rightPlayerState, rightPlayer);
  },
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
export type WAITING = 'waiting';

type GameStatus = READY | PLAYING | END | WAITING;

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

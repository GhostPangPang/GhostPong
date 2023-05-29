import { GameEvent } from '@/constants';
import { offEvent, onEvent } from '@/libs/api';
import { gameIdState, gameModeState, gamePlayerState, gameStatusState } from '@/stores';
import { useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { GameStart } from '@/dto/game';

interface Props {
  onGameStart?: () => void;
}

export const useGameStart = ({ onGameStart }: Props) => {
  const [gameId, setGameId] = useRecoilState(gameIdState);
  const [gameMode, setGameMode] = useRecoilState(gameModeState);
  const [gamePlayer, setGamePlayer] = useRecoilState(gamePlayerState);
  const setGameStatus = useSetRecoilState(gameStatusState);

  useEffect(() => {
    onEvent(GameEvent.GAMESTART, (data: GameStart) => {
      console.log('game-start', data);
      if (data) {
        setGameId(data.gameId);
        setGameMode(data.mode);
        setGamePlayer({
          leftPlayer: data.leftPlayer,
          rightPlayer: data.rightPlayer,
        });
        setTimeout(() => {
          setGameStatus('playing');
        }, 1000);
        onGameStart && onGameStart();
      }
    });

    return () => {
      offEvent(GameEvent.GAMESTART);
    };
  }, []);

  return { gameId, gameMode, gamePlayer };
};

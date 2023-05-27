import { GameEvent } from '@/constants';
import { offEvent, onEvent } from '@/libs/api';
import { gameIdState, gamePlayerState } from '@/stores';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { GameStart } from '@/dto/game';

interface Props {
  onGameStart: () => void;
}

export const useGameStart = ({ onGameStart }: Props) => {
  const [gameId, setGameId] = useRecoilState(gameIdState);
  const [gamePlayer, setGamePlayer] = useRecoilState(gamePlayerState);

  useEffect(() => {
    console.log('game start hook');
    onEvent(GameEvent.GAMESTART, (data: GameStart) => {
      console.log('game-start', data);
      setGameId(data.gameId);
      setGamePlayer({
        leftPlayer: data.leftPlayer,
        rightPlayer: data.rightPlayer,
      });
      onGameStart();
    });

    return () => {
      offEvent(GameEvent.GAMESTART);
    };
  }, []);

  return { gameId, gamePlayer };
};

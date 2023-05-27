import { ApiError, post } from '@/libs/api';
import { GameMode } from '@/dto/game';
import { useMutation } from '@tanstack/react-query';

const postGameStart = async ({ id, mode }: { id: string; mode: GameMode }) => {
  return await post('/game', { gameId: id, mode: mode });
};

export const useGameMutation = () => {
  const { mutate: startGame } = useMutation(postGameStart, {
    onSuccess: () => {
      console.log('game start');
    },
    onError: (error: ApiError) => {
      alert(error.message);
    },
  });

  return { startGame };
};

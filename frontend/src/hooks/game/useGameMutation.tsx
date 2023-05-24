import { ApiError, post } from '@/libs/api';
import { useMutation } from '@tanstack/react-query';

const postGameStart = async (id: string) => {
  return await post('/game', { gameId: id });
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

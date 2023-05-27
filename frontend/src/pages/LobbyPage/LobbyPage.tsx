import { Ghost, GameButton, Grid } from '@/common';
import { ApiError, post } from '@/libs/api';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const postRandomGame = async () => {
  return await post('/game/random');
};

export const LobbyPage = () => {
  const navigate = useNavigate();
  const { mutate: playRandomGame } = useMutation(postRandomGame, {
    onSuccess: (data) => {
      console.log('random data', data);
      navigate('/game/loading');
    },
    onError: (error: ApiError) => {
      console.log('random error', error);
    },
  });

  return (
    <Grid container="grid" rows={2} columns={3} rowsSize={[1, 0]} columnsSize={[1, 2, 1]} size={{ height: '100%' }}>
      <Grid gridColumn="2" alignSelf="center" justifySelf="center" size={{ height: '36rem', width: '36rem' }}>
        <Ghost />
      </Grid>
      <Grid gridColumn="1" gridRow="2" alignSelf="end">
        <GameButton size="md" onClick={() => navigate('/message')}>
          Message
        </GameButton>
      </Grid>
      <Grid container="flex" justifyContent="end" alignItems="end" gridColumn="2/4" gridRow="2" columnGap={1}>
        <GameButton size="md" onClick={() => navigate('/channel/list')}>
          Normal
        </GameButton>
        <GameButton size="md" onClick={() => playRandomGame()}>
          Random
        </GameButton>
      </Grid>
    </Grid>
  );
};

import { Ghost, GameButton, Grid } from '@/common';
import { useNavigate } from 'react-router-dom';

export const LobbyPage = () => {
  const navigate = useNavigate();

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
        <GameButton size="md">Random</GameButton>
      </Grid>
    </Grid>
  );
};

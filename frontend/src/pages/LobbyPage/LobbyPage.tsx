import { GameButton } from '@/common/GameButton';
import { Grid } from '@/layout/Grid';
import Rive from '@rive-app/react-canvas';

export const LobbyPage = () => {
  return (
    <Grid container="grid" rows={2} columns={3} rowsSize={[1, 0]} columnsSize={[1, 2, 1]} size={{ height: '100%' }}>
      <Grid gridColumn="2" alignSelf="center" justifySelf="center" size={{ height: '360px', width: '360px' }}>
        <Rive src="/riv/ghost.riv" />
      </Grid>
      <Grid gridColumn="1" gridRow="2" alignSelf="end">
        <GameButton size="md">Message</GameButton>
      </Grid>
      <Grid container="flex" justifyContent="end" alignItems="end" gridColumn="2/4" gridRow="2" columnGap={1}>
        <GameButton size="md">Normal</GameButton>
        <GameButton size="md">Random</GameButton>
      </Grid>
    </Grid>
  );
};

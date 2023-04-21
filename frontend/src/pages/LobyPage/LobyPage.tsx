import { Button } from '@/common/Button';
import { Grid } from '@/layout/Grid';
import Rive from '@rive-app/react-canvas';

export const LobyPage = () => {
  return (
    <Grid container="grid" rows={2} columns={3} rowsSize={[1, 0]} columnsSize={[1, 2, 1]}>
      <Grid gridColumn="2" alignSelf="center" justifySelf="center" size={{ height: '360px', width: '360px' }}>
        <Rive src="/riv/ghost.riv" />
      </Grid>
      <Grid gridColumn="1" gridRow="2" alignSelf="end">
        <Button size="md">Message</Button>
      </Grid>
      <Grid container="flex" justifyContent="end" alignItems="end" gridColumn="2/4" gridRow="2" columnGap={1}>
        <Button size="md">Normal</Button>
        <Button size="md">Random</Button>
      </Grid>
    </Grid>
  );
};

import { Grid } from '@/common';
import { GameHeader } from './GameHeader';
import { GameContent } from './GameContent';
import { useState } from 'react';

export const GameListPage = () => {
  const [cursor, setCursor] = useState(0);

  return (
    <Grid
      container="grid"
      rows={4}
      columns={3}
      justifyContent="center"
      alignItems="center"
      gap={4}
      size={{ height: 'auto', padding: 'md', maxWidth: '100rem' }}
    >
      <GameHeader cursor={cursor} setCursor={setCursor} />
      <GameContent cursor={cursor} />
    </Grid>
  );
};

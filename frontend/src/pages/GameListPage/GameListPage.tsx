import { Grid } from '@/common';
import { GameHeader } from './GameHeader';
import { GameContent } from './GameContent';
import { useChannelData } from '@/hooks/useChannelData';
import { useState } from 'react';

export const GameListPage = () => {
  const [cursor, setCursor] = useState(0);

  const { data, refetch } = useChannelData(cursor);

  const handleNextPage = () => {
    if (cursor + 1 > (data.total ?? 0) / 9) return;
    setCursor((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (cursor - 1 < 0) return;
    setCursor((prevPage) => prevPage - 1);
  };

  const handleRefetch = () => {
    refetch();
    setCursor(0);
  };
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
      <GameHeader fetchNextPage={handleNextPage} fetchPreviousPage={handlePrevPage} handleRefetch={handleRefetch} />
      <GameContent channels={data.channels} />
    </Grid>
  );
};

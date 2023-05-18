import { Grid } from '@/common';
import { GameSideBar } from './GameSideBar';
import { Suspense } from 'react';

import { Outlet } from 'react-router-dom';

interface GameContainerProps {
  children?: React.ReactNode;
}

const GameContainer = ({ children }: GameContainerProps) => {
  return (
    <Grid
      as="main"
      container="flex"
      direction="row"
      alignItems="center"
      style={{ position: 'relative', height: '100%' }}
    >
      <GameSideBar />
      <Grid container="flex" direction="column" justifyContent="center" size={{ height: '100%' }}>
        {children}
      </Grid>
    </Grid>
  );
};

export const GameLayout = () => {
  return (
    <GameContainer>
      <Suspense fallback={<></>}>
        <Outlet />
      </Suspense>
    </GameContainer>
  );
};

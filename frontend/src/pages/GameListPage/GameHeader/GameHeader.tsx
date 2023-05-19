import { Grid, Text, GameButton, Modal } from '@/common';
import { useState } from 'react';
import { ReactComponent as Refresh } from '@/svgs/refresh.svg';
import { ReactComponent as Left } from '@/svgs/left.svg';
import { ReactComponent as Right } from '@/svgs/right.svg';
import { GameCreateModal } from './GameCreateModal';

interface GameHeaderProps {
  fetchNextPage: () => void;
  fetchPreviousPage: () => void;
  handleRefetch: () => void;
}

export const GameHeader = ({ fetchNextPage, fetchPreviousPage, handleRefetch }: GameHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Grid
      container="flex"
      justifyContent="space-between"
      alignItems="center"
      gridRow="1"
      gridColumn="1/4"
      size={{ height: '100%' }}
    >
      <Text size="xxl" weight="bold" fontFamily="game" color="gray100">
        GameList
      </Text>
      <Grid container="flex" justifyContent="end" alignItems="center" gap={2}>
        <GameButton size="img" color="foreground" onClick={() => fetchPreviousPage()}>
          <Left />
        </GameButton>
        <GameButton size="img" color="foreground" onClick={() => fetchNextPage()}>
          <Right />
        </GameButton>
        <GameButton size="img" color="foreground" onClick={() => handleRefetch()}>
          <Refresh />
        </GameButton>
        <GameButton size="md" color="primary" onClick={() => setIsOpen(true)}>
          CREATE GAME
        </GameButton>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <GameCreateModal />
        </Modal>
      </Grid>
    </Grid>
  );
};

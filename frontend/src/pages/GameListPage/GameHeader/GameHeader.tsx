import { Grid, Text, GameButton, Modal } from '@/common';
import { useState } from 'react';
import { ReactComponent as Refresh } from '@/svgs/refresh.svg';
import { ReactComponent as Left } from '@/svgs/left.svg';
import { ReactComponent as Right } from '@/svgs/right.svg';
import { GameCreateModal } from './GameCreateModal';
import { useChannel } from '@/hooks/useChannel';

interface GameHeaderProps {
  cursor: number;
  setCursor: React.Dispatch<React.SetStateAction<number>>;
}

export const GameHeader = ({ cursor, setCursor }: GameHeaderProps) => {
  const { channels, refetchChannel } = useChannel({ cursor });

  const handleNextPage = () => {
    if (cursor + 1 > (channels.total ?? 0) / 9) return;
    setCursor((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (cursor - 1 < 0) return;
    setCursor((prevPage) => prevPage - 1);
  };

  const handleRefetch = () => {
    refetchChannel();
  };
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
        <GameButton size="img" color="foreground" onClick={() => handlePrevPage()}>
          <Left />
        </GameButton>
        <GameButton size="img" color="foreground" onClick={() => handleNextPage()}>
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

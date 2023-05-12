import { Grid, Text, Box, GameButton } from '@/common';
import styled from 'styled-components';
// index.ts로 묶어서 import하고 싶다. 그런데 잘 안된다.
import image1 from '@/assets/svgs/ChannelBackground1.png';
import image2 from '@/assets/svgs/ChannelBackground2.png';
import { ReactComponent as LockIcon } from '@/svgs/lock.svg';
import { ReactComponent as PeopleIcon } from '@/svgs/people.svg';
import { ReactComponent as Refresh } from '@/svgs/refresh.svg';
import { ReactComponent as Left } from '@/svgs/left.svg';
import { ReactComponent as Right } from '@/svgs/right.svg';

import { GameListData } from './mock-data';

interface GameListProps {
  id: number;
  name: string;
  mode: string;
  count: number;
}

interface GameItemProps extends GameListProps {
  backgroundImageUrl: string;
}

interface GameMatrixProps {
  channels: GameListProps[];
}

const { channels: Channels } = GameListData;

const StyledGameListItem = styled.article<{ backgroundImageUrl: string }>`
  height: 12.3rem;
  width: 37.2rem;
  background-image: url(${(props) => props.backgroundImageUrl});
  background-size: contain;
  border-radius: 1rem;
  position: relative;
  cursor: pointer;

  &:hover {
    background-color: rgba(256, 256, 256, 0.1);
  }
  &:active {
    background-color: rgba(0, 0, 0, 1);
  }
`;

const GameListItem = ({ backgroundImageUrl, name, mode, count }: GameItemProps) => {
  return (
    <StyledGameListItem backgroundImageUrl={backgroundImageUrl}>
      <Box backgroundColor="foregroundt" padding={0.5} width="100%">
        <Grid container="flex" justifyContent="space-between" alignItems="center">
          <Text size="xs" color="gray200" weight="bold" style={{ marginLeft: '0.5rem' }}>
            {name}
          </Text>
          {['protected', 'private'].includes(mode) && <LockIcon />}
        </Grid>
      </Box>
      <Grid
        container="flex"
        direction="row"
        alignItems="center"
        style={{ position: 'absolute', bottom: '0', left: '0', marginLeft: '0.5rem' }}
      >
        <PeopleIcon />
        <Text size="xs">{count.toString()}</Text>
      </Grid>
    </StyledGameListItem>
  );
};

const GameMatrix = ({ channels }: GameMatrixProps) => {
  return (
    <>
      {channels.map((channel) => {
        if (channel.id % 2 !== 0) {
          return (
            <GameListItem
              key={channel.id}
              id={channel.id}
              backgroundImageUrl={image1}
              name={channel.name}
              mode={channel.mode}
              count={channel.count}
            />
          );
        } else {
          return (
            <GameListItem
              key={channel.id}
              id={channel.id}
              backgroundImageUrl={image2}
              name={channel.name}
              mode={channel.mode}
              count={channel.count}
            />
          );
        }
      })}
    </>
  );
};

export const GameListPage = () => {
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
          <GameButton size="img" color="foreground">
            <Left />
          </GameButton>
          <GameButton size="img" color="foreground">
            <Right />
          </GameButton>
          <GameButton size="img" color="foreground">
            <Refresh />
          </GameButton>
          <GameButton size="md" color="primary">
            CREATE GAME
          </GameButton>
        </Grid>
      </Grid>
      <GameMatrix channels={Channels} />
    </Grid>
  );
};

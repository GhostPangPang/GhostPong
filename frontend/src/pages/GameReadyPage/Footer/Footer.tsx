import styled from 'styled-components';
import { Grid, Box, Avatar as BaseAvatar, Dropbox, GameButton } from '@/common';
import { MessageInput } from '@/pages/MessagePage/Message/MessageInput';
import { PlayerInfo } from '../mock-data';

interface FooterProps {
  observers: PlayerInfo[];
  currentUserId: number;
  items: { label: string; onClick: () => void }[];
}

interface ObserverBoxProps {
  observers: PlayerInfo[];
  currentUserId: number;
  items: { label: string; onClick: () => void }[];
}

const MessageBox = () => {
  return (
    <Box display="flex" direction="column-reverse" flexGrow={1}>
      <MessageInput />
    </Box>
  );
};

const Avatar = styled(BaseAvatar)`
  cursor: pointer;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: translateY(-0.5rem);
  }
`;

const ObserverBox = ({ observers, currentUserId, items }: ObserverBoxProps) => {
  return (
    <Grid container="flex" direction="row" alignItems="center" justifyContent="start" gap={1}>
      {observers.map((item, index) =>
        item.id == currentUserId ? (
          <Avatar size="md" borderColor="gradient" src={item.image} key={index} />
        ) : (
          <Dropbox items={items} desc={item.nickname} placement="topleft" key={index}>
            <Avatar size="md" borderColor="gradient" src={item.image} />
          </Dropbox>
        ),
      )}
    </Grid>
  );
};

export const Footer = ({ observers, currentUserId, items }: FooterProps) => {
  return (
    <Grid
      container="flex"
      direction="row"
      alignItems="end"
      justifyContent="center"
      size={{ height: '100%', padding: 'md' }}
    >
      <Grid container="flex" flexGrow={1} alignItems="center" size={{ padding: 'md' }}>
        <MessageBox />
      </Grid>
      <Grid container="flex" flexGrow={1} alignItems="center" size={{ padding: 'md' }}>
        <ObserverBox observers={observers} currentUserId={currentUserId} items={items} />
      </Grid>
      <Grid container="flex" flexGrow={1} alignItems="center" justifyContent="end" size={{ padding: 'md' }}>
        <GameButton size="md">START</GameButton>
      </Grid>
    </Grid>
  );
};

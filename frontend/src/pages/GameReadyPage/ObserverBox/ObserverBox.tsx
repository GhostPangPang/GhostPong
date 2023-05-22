import styled from 'styled-components';
import { Grid, Avatar as BaseAvatar, Dropbox } from '@/common';
import { MemberInfo } from '@/dto/channel/socket';
// import { PlayerInfo } from '../mock-data';

interface ObserverBoxProps {
  observers: MemberInfo[];
  currentUserId: number;
  items: { label: string; onClick: () => void }[];
}

const Avatar = styled(BaseAvatar)`
  cursor: pointer;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: translateY(-0.5rem);
  }
`;

export const ObserverBox = ({ observers, currentUserId, items }: ObserverBoxProps) => {
  return (
    <Grid container="flex" direction="row" alignItems="center" justifyContent="start" gap={1}>
      {observers.map((item, index) =>
        item.userId == currentUserId ? (
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

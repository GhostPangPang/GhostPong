import styled from 'styled-components';
import { Grid, Avatar as BaseAvatar, Dropbox } from '@/common';
import { MemberInfo } from '@/dto/channel/socket';
import { useUserInfo } from '@/hooks/user';
// import { useRecoilValue } from 'recoil';
// import { newChannelDataState } from '@/stores';
import { Items } from '@/libs/utils/itemgenerator';
// import { PlayerInfo } from '../mock-data';

interface ObserverBoxProps {
  observers: MemberInfo[];
  items: Items;
}

const Avatar = styled(BaseAvatar)`
  cursor: pointer;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: translateY(-0.5rem);
  }
`;

export const ObserverBox = ({ observers, items }: ObserverBoxProps) => {
  const { userInfo } = useUserInfo();

  return (
    <Grid container="flex" direction="row" alignItems="center" justifyContent="start" gap={1}>
      {observers.map((item, index) =>
        item.userId === userInfo.id ? (
          <Avatar size="md" borderColor="gradient" src={item.image} key={index} />
        ) : (
          <Dropbox items={items.observers[index]} desc={item.nickname} placement="topleft" key={index}>
            <Avatar size="md" borderColor="gradient" src={item.image} />
          </Dropbox>
        ),
      )}
    </Grid>
  );
};

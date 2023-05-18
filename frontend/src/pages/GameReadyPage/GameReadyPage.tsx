import { RoomInfo } from './RoomInfo';
import { Versus } from './Versus';
import { Footer } from './Footer';
import { Grid } from '@/common';
import { chnnelInfoMockData, CurrentUserId } from './mock-data';

const { name, players, observers } = chnnelInfoMockData;

const getCurrentInfo = (id: number) => {
  const player = players.find((player) => player.id === id);
  const observer = observers.find((observer) => observer.id === id);

  if (player) {
    return player.role;
  } else if (observer) {
    return observer.role;
  } else {
    return null;
  }
};

// useItem hook 으로 빼기
const itemGenerator = (role: 'owner' | 'admin' | 'member' | null) => {
  switch (role) {
    case 'owner':
      return [
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        { label: '관리자 등록', onClick: () => {} },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        { label: 'KICK', onClick: () => {} },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        { label: 'MUTE', onClick: () => {} },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        { label: 'BAN', onClick: () => {} },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        { label: '친구추가', onClick: () => {} },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        { label: '차단', onClick: () => {} },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        { label: '프로필', onClick: () => {} },
      ];

    case 'admin':
      return [
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        { label: 'KICK', onClick: () => {} },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        { label: 'MUTE', onClick: () => {} },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        { label: 'BAN', onClick: () => {} },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        { label: '친구추가', onClick: () => {} },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        { label: '차단', onClick: () => {} },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        { label: '프로필', onClick: () => {} },
      ];
    case 'member':
      return [
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        { label: '친구추가', onClick: () => {} },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        { label: '차단', onClick: () => {} },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        { label: '프로필', onClick: () => {} },
      ];
    default:
      return [];
  }
};

export const GameReadyPage = () => {
  const CurrentUserRole = getCurrentInfo(CurrentUserId);
  const items = itemGenerator(CurrentUserRole);

  return (
    <>
      <Grid container="flex" direction="row" alignItems="center" justifyContent="center" flexGrow={1}>
        <RoomInfo name={name} />
      </Grid>
      <Grid container="flex" direction="row" alignItems="center" justifyContent="center" flexGrow={1}>
        <Versus players={players} currentUserId={CurrentUserId} items={items} />
      </Grid>
      <Grid container="flex" direction="row" alignItems="center" justifyContent="center" flexGrow={1}>
        <Footer observers={observers} currentUserId={CurrentUserId} items={items} />
      </Grid>
    </>
  );
};

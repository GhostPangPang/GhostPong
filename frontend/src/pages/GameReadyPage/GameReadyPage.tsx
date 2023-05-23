import { RoomInfo } from './RoomInfo';
import { Versus } from './Versus';
import { ChatBox } from './ChatBox';
import { ObserverBox } from './ObserverBox';
import { Grid, GameButton } from '@/common';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { newChannelDataState, socketState } from '@/stores';
import { useEffect } from 'react';
import { useChannelInfo, useLeaveChannel } from '@/hooks/channel';
import { useLocation } from 'react-router-dom';
// useItem hook 으로 빼기
export const itemGenerator = (role: 'owner' | 'admin' | 'member' | undefined) => {
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
  const setSocket = useSetRecoilState(socketState);
  const { leaveChannel } = useLeaveChannel();

  const { pathname } = useLocation();
  const channelId = pathname.replace('/channel/', '');

  useChannelInfo(channelId);

  const newChannelData = useRecoilValue(newChannelDataState);

  useEffect(() => {
    setSocket((prev) => ({ ...prev, channel: true })); // 이것도 리팩토링 고민해보기

    return () => setSocket((prev) => ({ ...prev, channel: false }));
  }, []);

  // unload 이벤트는 브라우저가 닫히거나 페이지를 떠날 때 발생합니다.
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.onpopstate = function () {
      leaveChannel(channelId);
      alert('뒤로가기를 누르면 채널에서 나가집니다.');
    };

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <>
      <Grid container="flex" direction="row" alignItems="center" justifyContent="center" flexGrow={1}>
        <RoomInfo name={newChannelData.name} />
      </Grid>

      <Grid container="flex" direction="row" alignItems="center" justifyContent="center" flexGrow={1}>
        {newChannelData.isInGame ? (
          <div>게임중</div> // gmae view component 추가
        ) : (
          <Versus
            leftPlayer={newChannelData.leftPlayer}
            rightPlayer={newChannelData.rightPlayer}
            items={itemGenerator(newChannelData.currentRole)}
          />
        )}
      </Grid>
      <Grid container="flex" direction="row" alignItems="end" justifyContent="center" flexGrow={1}>
        <Grid container="flex" flexGrow={1} alignItems="center" size={{ padding: 'md' }}>
          <ChatBox />
        </Grid>
        <Grid container="flex" flexGrow={1} alignItems="center" size={{ padding: 'md' }}>
          <ObserverBox
            observers={newChannelData.observers}
            currentUserId={newChannelData.currentUserId}
            items={itemGenerator(newChannelData.currentRole)}
          />
        </Grid>
        <Grid container="flex" flexGrow={1} alignItems="center" justifyContent="end" size={{ padding: 'md' }}>
          {newChannelData.isInGame ? null : newChannelData.currentRole === 'owner' ? ( // gmaeReady 중인 owner 만 start 버튼 보이게
            <GameButton size="md">START</GameButton>
          ) : null}
        </Grid>
      </Grid>
    </>
  );
};

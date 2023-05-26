import { RoomInfo } from './RoomInfo';
import { Versus } from './Versus';
import { ChatBox } from './ChatBox';
import { ObserverBox } from './ObserverBox';
import { Grid, GameButton } from '@/common';
import { useRecoilState, useRecoilValueLoadable, useResetRecoilState, useSetRecoilState } from 'recoil';
import { channelIdState, channelDataState, socketState } from '@/stores';
import { useChannel } from '@/hooks/channel';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { itemGenerator } from '@/libs/utils/itemgenerator';
import { useGameMutation, useGameStart } from '@/hooks/game';
// useItem hook 으로 빼기

export const GameReadyPage = () => {
  const setSocket = useSetRecoilState(socketState);
  const { pathname } = useLocation();
  const [channelId, setChannelId] = useRecoilState(channelIdState);
  const resetChannelId = useResetRecoilState(channelIdState);

  const { startGame } = useGameMutation();

  const { refetchChannel } = useChannel(channelId);
  const [channelData, setChannelData] = useRecoilState(channelDataState);
  const { isInGame, leftPlayer, rightPlayer } = channelData;

  useGameStart({
    onGameStart: () => {
      setChannelData((prev) => ({ ...prev, isInGame: true }));
    },
  });

  useEffect(() => {
    const channelId = pathname.replace('/channel/', '');
    console.log('channelId', channelId);
    setChannelId(channelId);

    return () => {
      resetChannelId();
    };
  }, []);

  const handleStartGame = () => {
    // 임시로 새로 채널 정보 가져오게 하기
    startGame({ id: channelId, mode: 'normal' });

    if (!channelData.leftPlayer || !channelData.rightPlayer) {
      alert('플레이어가 없습니다.');
      return;
    }
  };

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

    // 뒤로가기 막기
    history.pushState(null, location.href);
    window.onpopstate = function (event) {
      event.preventDefault();
      history.go(1);
    };

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [channelId]);

  // 그냥 socket liesten을 여기서 하면 구조가 괜찮을지도?
  // 렌더링 전에 한 번 실행

  // const items = itemGenerator(channelData);

  const channelDataLoadable = useRecoilValueLoadable(channelDataState);

  console.log('loadable', channelDataLoadable);
  let items = itemGenerator(channelData);

  if (channelDataLoadable.state === 'hasValue') {
    items = itemGenerator(channelData);
  }
  return (
    <>
      <Grid container="flex" direction="row" alignItems="center" justifyContent="center" flexGrow={1}>
        <RoomInfo />
      </Grid>

      <Grid container="flex" direction="row" alignItems="center" justifyContent="center" flexGrow={1}>
        {isInGame && leftPlayer && rightPlayer ? (
          <>
            {/* // <PingPongGame
          //   type={
          //     leftPlayer.userId === userId ? 'leftPlayer' : rightPlayer.userId === userId ? 'rightPlayer' : 'observer'
          //   }
          // /> */}
          </>
        ) : (
          <Versus leftPlayer={channelData.leftPlayer} rightPlayer={channelData.rightPlayer} items={items} />
        )}
      </Grid>
      <Grid container="flex" direction="row" alignItems="end" justifyContent="center" flexGrow={1}>
        <Grid container="flex" flexGrow={1} alignItems="center" size={{ padding: 'md' }}>
          <ChatBox />
        </Grid>
        <Grid container="flex" flexGrow={1} alignItems="center" size={{ padding: 'md' }}>
          <ObserverBox observers={channelData.observers} items={items} />
        </Grid>
        <Grid container="flex" flexGrow={1} alignItems="center" justifyContent="end" size={{ padding: 'md' }}>
          {channelData.isInGame ? null : channelData.currentRole === 'owner' ? ( // gmaeReady 중인 owner 만 start 버튼 보이게
            <GameButton size="md" onClick={handleStartGame}>
              START
            </GameButton>
          ) : null}
        </Grid>
      </Grid>
    </>
  );
};

import { RoomInfo } from './RoomInfo';
import { Versus } from './Versus';
import { ChatBox } from './ChatBox';
import { ObserverBox } from './ObserverBox';
import { Grid, GameButton, Text } from '@/common';
import { useRecoilState, useRecoilValueLoadable, useResetRecoilState, useSetRecoilState } from 'recoil';
import { channelIdState, channelDataState, socketState } from '@/stores';
import { useChannel } from '@/hooks/channel';
import { useLocation } from 'react-router-dom';
import { ChangeEvent, useEffect, useState } from 'react';
import { itemGenerator } from '@/libs/utils/itemgenerator';
import { useGameMutation, useGameStart } from '@/hooks/game';
import { Dropdown } from '@/common/Dropdown';
import { GameMode } from '@/dto/game';
import { PingPongGame } from '../GamePage';
// useItem hook 으로 빼기

export const GameReadyPage = () => {
  const setSocket = useSetRecoilState(socketState);
  const { pathname } = useLocation();
  const [channelId, setChannelId] = useRecoilState(channelIdState);
  const resetChannelId = useResetRecoilState(channelIdState);

  const { refetchChannel } = useChannel(channelId);
  const [channelData, setChannelData] = useRecoilState(channelDataState);
  const { isInGame, leftPlayer, rightPlayer } = channelData;

  const { startGame } = useGameMutation();
  const [mode, setMode] = useState<GameMode>('normal');

  useGameStart({
    onGameStart: () => {
      setChannelData((prev) => ({ ...prev, isInGame: true }));
    },
  });

  useEffect(() => {
    const channelId = pathname.replace('/channel/', '');
    setChannelId(channelId);

    return () => {
      resetChannelId();
    };
  }, []);

  const handleStartGame = () => {
    // 임시로 새로 채널 정보 가져오게 하기
    startGame({ id: channelId, mode: mode });

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

  const handleModeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const modeString = e.target.value;
    switch (modeString) {
      case '노멀모드':
        setMode('normal');
        break;
      case '스피드모드':
        setMode('speed');
        break;
      case '바보모드':
        setMode('stupid');
        break;
    }
  };

  const channelDataLoadable = useRecoilValueLoadable(channelDataState);

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
          <PingPongGame />
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
        <Grid container="flex" flexGrow={1} alignItems="center" justifyContent="end" gap={2} size={{ padding: 'md' }}>
          {channelData.isInGame ? null : channelData.currentRole === 'owner' ? ( // gmaeReady 중인 owner 만 start 버튼 보이게
            <>
              <Dropdown onChange={handleModeChange}>
                <Text as="option">노멀모드</Text>
                <Text as="option">스피드모드</Text>
                <Text as="option">바보모드</Text>
              </Dropdown>
              <GameButton size="md" onClick={handleStartGame}>
                START
              </GameButton>
            </>
          ) : null}
        </Grid>
      </Grid>
    </>
  );
};

import { RoomInfo } from './RoomInfo';
import { Versus } from './Versus';
import { ChatBox } from './ChatBox';
import { ObserverBox } from './ObserverBox';
import { Grid, GameButton, Text } from '@/common';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import { channelIdState, channelDataState, socketState } from '@/stores';
import { useChannel, useLeaveChannel } from '@/hooks/channel';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChangeEvent, useEffect, useState } from 'react';
import { useItemGenerator, Items } from '@/libs/utils/itemgenerator';
import { useGameMutation, useGameStart } from '@/hooks/game';
import { Dropdown } from '@/common/Dropdown';
import { GameMode } from '@/dto/game';
import { PingPongGame } from '../GamePage';
import { useBlocked } from '@/hooks/blocked';

export const GameReadyPage = () => {
  const setSocket = useSetRecoilState(socketState);
  const { pathname } = useLocation();
  const [channelId, setChannelId] = useRecoilState(channelIdState);
  const resetChannelId = useResetRecoilState(channelIdState);
  const { blocked } = useBlocked();

  const { refetchChannel } = useChannel(channelId);
  const [channelData, setChannelData] = useRecoilState(channelDataState);
  const { isInGame, leftPlayer, rightPlayer } = channelData;
  const { leaveChannel } = useLeaveChannel();

  const { startGame } = useGameMutation();
  const [mode, setMode] = useState<GameMode>('normal');
  const [items, setItems] = useState<Items>({
    leftPlayer: [],
    rightPlayer: [],
    observers: [],
  });
  const navigate = useNavigate();

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

  const itemsGenerator = useItemGenerator();

  useEffect(() => {
    setItems(itemsGenerator);
  }, [channelData]);

  const handleStartGame = () => {
    // 임시로 새로 채널 정보 가져오게 하기
    if (!channelData.leftPlayer || !channelData.rightPlayer) {
      alert('플레이어가 없습니다.');
      return;
    }
    startGame({ id: channelId, mode: mode });
  };

  useEffect(() => {
    setSocket((prev) => ({ ...prev, channel: true })); // 이것도 리팩토링 고민해보기

    return () => {
      setSocket((prev) => ({ ...prev, channel: false }));
    };
  }, []);

  // unload 이벤트는 브라우저가 닫히거나 페이지를 떠날 때 발생합니다.
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
      return '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    history.pushState(null, location.href);
    window.onpopstate = function () {
      if (window.confirm('뒤로 가시겠습니까?')) {
        leaveChannel(channelId);
        navigate('/channel/list');
      }
    };

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [channelId]);

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

  return (
    <>
      <Grid container="flex" direction="row" alignItems="center" justifyContent="center" flexGrow={1}>
        <RoomInfo />
      </Grid>

      <Grid container="flex" direction="row" alignItems="center" justifyContent="center" flexGrow={1}>
        {isInGame && leftPlayer && rightPlayer ? <PingPongGame /> : <Versus items={items} />}
      </Grid>
      <Grid container="flex" direction="row" alignItems="end" justifyContent="center" flexGrow={1}>
        <Grid container="flex" flexGrow={1} alignItems="center" size={{ padding: 'md' }}>
          <ChatBox />
        </Grid>
        <Grid container="flex" flexGrow={1} alignItems="center" size={{ padding: 'md' }}>
          <ObserverBox items={items} />
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

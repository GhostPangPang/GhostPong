import { RoomInfo } from './RoomInfo';
import { Versus } from './Versus';
import { ChatBox } from './ChatBox';
import { ObserverBox } from './ObserverBox';
import { Grid, GameButton } from '@/common';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { channelIdState, channelDataState, socketState } from '@/stores';
import { useChannel, useLeaveChannel } from '@/hooks/channel';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { itemGenerator } from '@/libs/utils/itemgenerator';
// useItem hook 으로 빼기

export const GameReadyPage = () => {
  const setSocket = useSetRecoilState(socketState);
  const { pathname } = useLocation();
  const { leaveChannel } = useLeaveChannel();
  const [channelId, setChannelId] = useRecoilState(channelIdState);
  // const { startGame } = useGameMutation();

  const { refetchChannel } = useChannel(channelId);
  const channelData = useRecoilValue(channelDataState);
  const { isInGame, leftPlayer, rightPlayer } = channelData;

  useEffect(() => {
    const channelId = pathname.replace('/channel/', '');
    setChannelId(channelId);

    // socket 통신 받아서 navigate 하기
    // onEvent(GameEvent.GAMESTART, (data: { gameId: string }) => {
    //   console.log('game-start 이벤트왔다', data);
    //   setChannelData({
    //     ...channelData,
    //     isInGame: true,
    //   });
    // });
  }, []);

  const handleStartGame = () => {
    // 임시로 새로 채널 정보 가져오게 하기
    refetchChannel();

    if (!channelData.leftPlayer || !channelData.rightPlayer) {
      alert('플레이어가 없습니다.');
      return;
    }

    // 성공했을 때만 설정하고 싶은뎅 고민해보기
    // startGame(channelId, {
    //   onSuccess: (data: ApiResponse) => {
    //     console.log(data);

    //     setGamePlayer({
    //       leftUser: channelData.leftPlayer,
    //       rightUser: channelData.rightPlayer,
    //     });
    //     setGameId(channelId);
    //   },
    // });
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
    window.onpopstate = function () {
      leaveChannel(channelId);
      alert('뒤로가기를 누르면 채널에서 나가집니다.');
    };

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const items = itemGenerator();

  return (
    <>
      <Grid container="flex" direction="row" alignItems="center" justifyContent="center" flexGrow={1}>
        <RoomInfo name={channelData.name} />
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

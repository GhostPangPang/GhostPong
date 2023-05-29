import theme from '@/assets/styles/theme';
import { MouseEvent, useEffect } from 'react';
import { useCanvas } from '@/hooks';
import { usePingPongGame } from './usePingPongGame';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { gameMemberTypeState, gamePlayerState, socketState } from '@/stores';
import { GameResultModal } from './GameResultModal/GameResultModal';
import { useUserInfo } from '@/hooks/user';
import { Avatar, Grid, Text } from '@/common';

export const PingPongGame = () => {
  const setSocket = useSetRecoilState(socketState);
  const setGameMemberType = useSetRecoilState(gameMemberTypeState);
  const {
    userInfo: { id: userId },
  } = useUserInfo();
  const { gameStatus, setCanvasSize, playGame, moveBar } = usePingPongGame();
  const { leftPlayer, rightPlayer } = useRecoilValue(gamePlayerState);

  const isEnd = gameStatus === 'end';
  const canvasRef = useCanvas(playGame, isEnd);

  useEffect(() => {
    if (!leftPlayer || !rightPlayer) return;

    if (userId === leftPlayer.userId) setGameMemberType('leftPlayer');
    else if (userId === rightPlayer.userId) setGameMemberType('rightPlayer');

    const canvas = canvasRef.current;
    if (canvas) {
      setSocket((prev) => ({ ...prev, game: true }));
      setCanvasSize({ width: canvas.clientWidth, height: canvas.clientHeight });
    }
    return () => {
      setSocket((prev) => ({ ...prev, game: false }));
    };
  }, []);

  const handleMouseMove = (e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    moveBar(e.clientY - rect.top);
  };

  return (
    <Grid
      as="section"
      container="flex"
      direction="column"
      justifyContent="center"
      alignItems="center"
      gap={1}
      size={{ maxWidth: '160rem', padding: 'lg' }}
    >
      <PlayerInfo />
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        style={{ aspectRatio: '2 / 1', width: '100%', borderRadius: '4px', backgroundColor: theme.color.gray500 }}
      ></canvas>
      <GameResultModal isEnd={gameStatus === 'end'} />
    </Grid>
  );
};

export const PlayerInfo = () => {
  const gamePlayer = useRecoilValue(gamePlayerState);
  const { leftPlayer, rightPlayer } = gamePlayer;

  return (
    <Grid container="flex" justifyContent="space-between" alignItems="center" size={{ padding: 'sm' }}>
      <Grid container="flex" alignItems="center" gap={2} size={{ width: 'auto' }}>
        <Avatar size="md" src={leftPlayer?.image} />
        <Text size="md">{leftPlayer?.nickname ?? 'Player1'}</Text>
      </Grid>
      <Text size="md" fontFamily="game" shadow="md" color="online">
        VS
      </Text>
      <Grid container="flex" alignItems="center" gap={2} size={{ width: 'auto' }}>
        <Text size="md">{rightPlayer?.nickname ?? 'Player2'}</Text>
        <Avatar size="md" src={rightPlayer?.image} />
      </Grid>
    </Grid>
  );
};

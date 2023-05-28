import theme from '@/assets/styles/theme';
import { MouseEvent, useEffect } from 'react';
import { useCanvas } from '@/hooks';
import { usePingPongGame } from './usePingPongGame';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { gameMemberTypeState, socketState } from '@/stores';
import { GameResultModal } from './GameResultModal/GameResultModal';
import { useUserInfo } from '@/hooks/user';

export const PingPongGame = () => {
  const setSocket = useSetRecoilState(socketState);
  const [gameMemberType, setGameMemberType] = useRecoilState(gameMemberTypeState);
  const {
    userInfo: { id: userId },
  } = useUserInfo();
  const { gamePlayer, gameStatus, setCanvasSize, playGame, moveBar } = usePingPongGame();

  const isEnd = gameStatus === 'end';
  const canvasRef = useCanvas(playGame, isEnd);

  useEffect(() => {
    if (!gamePlayer.leftPlayer || !gamePlayer.rightPlayer) return;

    const { leftPlayer, rightPlayer } = gamePlayer;

    if (userId === leftPlayer.userId) setGameMemberType('leftPlayer');
    else if (userId === rightPlayer.userId) setGameMemberType('rightPlayer');

    const canvas = canvasRef.current;
    if (canvas) {
      setSocket((prev) => ({ ...prev, game: true }));
      setCanvasSize({ width: canvas.clientWidth, height: canvas.clientHeight });
    }
    return () => setSocket((prev) => ({ ...prev, game: false }));
  }, []);

  const handleMouseMove = (e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    moveBar(e.clientY - rect.top);
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        style={{ aspectRatio: '2 / 1', width: '90%', borderRadius: '4px', backgroundColor: theme.color.gray500 }}
      ></canvas>
      <GameResultModal isEnd={gameStatus === 'end'} />
    </>
  );
};

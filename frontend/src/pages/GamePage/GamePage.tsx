import theme from '@/assets/styles/theme';
import { MouseEvent, useEffect, useState } from 'react';
import { useCanvas } from '@/hooks';
import { usePingPongGame } from './usePingPongGame';
import { useSetRecoilState } from 'recoil';
import { socketState } from '@/stores';
import { GameResultModal } from './GameResultModal/GameResultModal';
import { useUserInfo } from '@/hooks/user';

export type MemberType = 'leftPlayer' | 'rightPlayer' | 'observer';

export const PingPongGame = () => {
  const setSocket = useSetRecoilState(socketState);
  const {
    userInfo: { id: userId },
  } = useUserInfo();

  const [type, setType] = useState<MemberType>('observer');
  const { gamePlayer, gameStatus, setCanvasSize, playGame, moveBar } = usePingPongGame();

  const isEnd = gameStatus === 'end';
  const canvasRef = useCanvas(playGame, isEnd);

  useEffect(() => {
    if (!gamePlayer.leftPlayer || !gamePlayer.rightPlayer) return;

    if (gamePlayer.leftPlayer.userId === userId) {
      setType('leftPlayer');
    } else if (gamePlayer.rightPlayer.userId === userId) {
      setType('rightPlayer');
    } else {
      setType('observer');
    }

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
    if (type === 'leftPlayer') {
      moveBar(type, e.clientY - rect.top);
    } else if (type === 'rightPlayer') {
      moveBar(type, e.clientY - rect.top);
    }
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        style={{ aspectRatio: '2 / 1', width: '90rem', borderRadius: '4px', backgroundColor: theme.color.gray500 }}
      ></canvas>
      <GameResultModal isEnd={gameStatus === 'end'} />
    </div>
  );
};

import theme from '@/assets/styles/theme';
import { MouseEvent, useEffect, useState } from 'react';
import { useCanvas } from '@/hooks';
import { usePingPongGame } from './usePingPongGame';
import { useSetRecoilState } from 'recoil';
import { socketState } from '@/stores';
import { GameResultModal } from './GameResultModal/GameResultModal';

export type MemberType = 'leftPlayer' | 'rightPlayer' | 'observer';

export interface GamePageProps {
  type: MemberType;
}

// default member 로 바꾸어야함
export const PingPongGame = ({ type = 'rightPlayer' }: GamePageProps) => {
  const setSocket = useSetRecoilState(socketState);

  const { gameStatus, setCanvasSize, playGame, moveBar } = usePingPongGame();
  const [isEnd, setIsEnd] = useState(true);

  const canvasRef = useCanvas(playGame, isEnd);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      setSocket((prev) => ({ ...prev, game: true }));
      setCanvasSize({ width: canvas.clientWidth, height: canvas.clientHeight });
    }
    return () => setSocket((prev) => ({ ...prev, game: false }));
  }, []);

  useEffect(() => {
    if (gameStatus === 'end') {
      setIsEnd(true);
    }
  }, [gameStatus]);

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
      <GameResultModal isEnd={isEnd} />
    </div>
  );
};

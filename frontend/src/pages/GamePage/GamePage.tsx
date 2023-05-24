import theme from '@/assets/styles/theme';
// import { GamePageWrapper } from '../GameReadyPage/GameReadyPage';
import { MouseEvent, useEffect } from 'react';
import { useCanvas } from '@/hooks';
import { usePingPongGame } from './usePingPongGame';
import { useSetRecoilState } from 'recoil';
import { socketState } from '@/stores';
import { emitEvent } from '@/libs/api';
import { GameEvent } from '@/constants';

export type MemberType = 'leftPlayer' | 'rightPlayer' | 'observer';

export interface GamePageProps {
  type: MemberType;
}

// default member 로 바꾸어야함
export const PingPongGame = ({ type = 'rightPlayer' }: GamePageProps) => {
  const setSocket = useSetRecoilState(socketState);
  const { gameStatus, setCanvasSize, playGame, moveBar } = usePingPongGame();
  const canvasRef = useCanvas(playGame, gameStatus === 'end');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    setSocket((prev) => ({ ...prev, game: true }));
    setCanvasSize({ width: canvas.clientWidth, height: canvas.clientHeight });

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
    </div>
  );
};

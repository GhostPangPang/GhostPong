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
  channelId: string;
}

export const GamePage = ({ type = 'rightPlayer', channelId = '1' }: GamePageProps) => {
  const setSocket = useSetRecoilState(socketState);
  const { setCanvasSize, playGame, moveBar, drawCountDown } = usePingPongGame({
    channelId,
    leftPlayerId: 2,
    rightPlayerId: 1,
  });
  const canvasRef = useCanvas(playGame);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    setSocket((prev) => ({ ...prev, game: true }));

    drawCountDown(context, canvas.width, canvas.height);
    setTimeout(() => {
      // 이거 두개는 합쳐도 될듯
      setCanvasSize({ width: canvas.width, height: canvas.height });
      emitEvent(GameEvent.GAMESTART, { gameId: channelId });
    }, 3000);

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
        width={900}
        height={450}
        onMouseMove={handleMouseMove}
        style={{ borderRadius: '4px', backgroundColor: theme.color.gray500 }}
      ></canvas>
    </div>
  );
};

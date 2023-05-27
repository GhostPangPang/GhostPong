import { useEffect, useLayoutEffect, useRef } from 'react';

export interface CanvasProps {
  draw: (ctx: CanvasRenderingContext2D) => void;
  width: number;
  height: number;
}

// fps
export const useCanvas = (draw: (ctx: CanvasRenderingContext2D) => void, shouldStopAnimation = false) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // initialize canvas size
  useLayoutEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const devicePixelRatio = window.devicePixelRatio || 1;
      console.log('useCanvas', canvas.clientWidth, canvas.clientHeight, devicePixelRatio);
      canvas.width = canvas.clientWidth * devicePixelRatio;
      canvas.height = canvas.clientHeight * devicePixelRatio;

      const context = canvas.getContext('2d');
      if (context) {
        context.scale(devicePixelRatio, devicePixelRatio);
        // setContext(canvas.getContext('2d'));
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;
    const context = canvas.getContext('2d');

    const render = () => {
      if (context) {
        draw(context);
      }
      animationFrameId.current = requestAnimationFrame(render);
    };

    // render();
    animationFrameId.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [draw]);

  useEffect(() => {
    if (shouldStopAnimation) {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    }
  }, [shouldStopAnimation]);

  return canvasRef;
};

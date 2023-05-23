import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export const useCanvas = (draw: (ctx: CanvasRenderingContext2D) => void) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  // initialize canvas size
  useLayoutEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      setContext(canvas.getContext('2d'));
    }
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const render = () => {
      if (context) {
        draw(context);
      }
      animationFrameId = requestAnimationFrame(render);
    };
    animationFrameId = requestAnimationFrame(render);
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [context, draw]);

  return canvasRef;
};

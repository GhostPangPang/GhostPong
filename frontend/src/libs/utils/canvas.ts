export function drawArc(context: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  context.fillStyle = color;
  context.beginPath();
  console.log(x, y);
  context.arc(x, y, r, 0, Math.PI * 2, true);
  context.closePath();
  context.fill();
}

export const drawText = (
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color: string,
  size?: number,
  font?: string,
) => {
  context.fillStyle = color;
  context.font = `${size || 36}px ${font || 'normal'}`;
  context.fillText(text, x, y);
};

export const drawRect = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
) => {
  context.fillStyle = color;
  context.fillRect(x, y, w, h);
};

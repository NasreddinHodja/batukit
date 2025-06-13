import { Color } from '@/renderer';

interface RenderOptions {
  foreground: Color;
  background: Color;
}

export class CanvasRenderer {
  constructor(
    public context: CanvasRenderingContext2D,
    public options?: RenderOptions
  ) {
    this.options = options ?? {
      foreground: new Color('#000000'),
      background: new Color('#ffffff'),
    };
  }

  drawBackground() {
    const canvas = this.context.canvas;
    this.context.fillStyle = 'white';
    this.context.fillRect(0, 0, canvas.width, canvas.height);
  }

  drawLine(x1: number, y1: number, x2: number, y2: number) {
    console.log(`drawLine(x1: ${x1}, y1: ${y1}, x2: ${x2}, y2: ${y2})`);
  }
  drawCircle(x: number, y: number, r: number) {
    console.log(`drawCircle(x: ${x}, y: ${y}, r: ${r}`);
  }
  drawText(text: string, x: number, y: number) {
    console.log(`drawText(text: ${text}, x: ${x}, y: ${y}`);
  }
}

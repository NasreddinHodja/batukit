import { CanvasRenderer } from '@/renderer';

export interface Renderable {
  render(renderer: CanvasRenderer): void;
}

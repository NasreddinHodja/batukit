import { Staff } from '@/score';
import { CanvasRenderer } from '@/renderer';
import { Renderable } from '@/renderables';

export function staffToRenderable(staff: Staff, x: number, y: number): Renderable {
  return {
    render(renderer: CanvasRenderer) {
      renderer.drawStaff(staff, x, y);
    },
  };
}

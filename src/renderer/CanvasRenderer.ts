import { Note } from '@/score';
import { Color } from './Color';
import opentype, { Font, Path } from 'opentype.js';

interface RenderOptions {
  foreground: Color;
  background: Color;
}

export class CanvasRenderer {
  private font: Font | null = null;

  private constructor(
    public context: CanvasRenderingContext2D,
    public width: number = 600,
    public height: number = 300,
    public options?: RenderOptions
  ) {
    this.context.canvas.width = width;
    this.context.canvas.height = height;
    this.context.canvas.style.width = `${width}px`;
    this.context.canvas.style.height = `${height}px`;
    this.options = options ?? CanvasRenderer.getDefaultOptions();
  }

  static async init(
    ctx: CanvasRenderingContext2D,
    width: number = 600,
    height: number = 300,
    options?: RenderOptions
  ): Promise<CanvasRenderer> {
    const renderer = new CanvasRenderer(ctx, width, height, options);
    await renderer.ensureFontLoaded();
    return renderer;
  }

  async loadFont() {
    if (this.font) return;
    const bravuraURL = new URL('../fonts/Bravura.otf', import.meta.url).toString();
    const response = await fetch(bravuraURL);
    const arrayBuffer = await response.arrayBuffer();
    this.font = opentype.parse(arrayBuffer);
  }

  async drawPath(path: Path2D) {
    await this.ensureFontLoaded();

    this.setForegroundFillStyle();
    this.context.fill(path);
  }

  async ensureFontLoaded() {
    if (!this.font) await this.loadFont();
  }

  drawBackground() {
    const canvas = this.context.canvas;
    this.context.fillStyle = 'white';
    this.context.fillRect(0, 0, canvas.width, canvas.height);
  }

  async drawNote(note: Note, x: number, y: number) {
    const indices = note.toGlyphIndices();
    const path = this.combinePaths(
      indices.map((i) => this.getGlyphPath(i, x, y)).filter((p) => p !== undefined)
    );
    const canvasPath = new Path2D(path.toPathData(2));
    await this.drawPath(canvasPath);
  }

  getGlyphPath(index: number, x: number, y: number, size: number = 48): Path {
    const glyph = this.font?.glyphs.get(index);
    if (!glyph) {
      throw Error(`Glyph ${index} not found`);
    }
    const path = glyph.getPath(x, y, size);
    return path;
  }

  combinePaths(paths: Path[]): Path {
    const combined = new opentype.Path();
    combined.commands.push(...paths.flatMap((p) => p.commands));
    return combined;
  }

  setForegroundFillStyle() {
    this.context.fillStyle = (this.options?.foreground.hex ??
      CanvasRenderer.getDefaultOptions().foreground) as string;
  }

  static getDefaultOptions() {
    return {
      foreground: new Color('#ffffff'),
      background: new Color('#000000'),
    };
  }
}

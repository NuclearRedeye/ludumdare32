import { width, height } from './constants.js';
import { TileSet } from './tile-set.js';
import { Rect } from './rect.js';

export type Map = string[][];

export class Layer {
  private n: string; // Layer Name
  private d: Map; // Layer Array Data
  private ts: TileSet; // Layer Tile Set
  private sf: number; // Layer Scale Factor
  private v: boolean; // Layer visible
  private pr: boolean; // Prerender Layer
  private c: HTMLCanvasElement; // Layer offscreen surface
  private cxt: CanvasRenderingContext2D;

  constructor(n: string, d: Map, ts: TileSet, sf: number) {
    console.log('Layer()');
    this.n = n; // Layer Name
    this.d = d; // Layer Array Data
    this.ts = ts; // Layer Tile Set
    this.sf = sf; // Layer Scale Factor
    this.v = true; // Layer visible
    this.pr = true; // Prerender Layer

    this.c = document.createElement('canvas');
    this.c.width = this.d[0].length * (this.ts.tw * this.sf);
    this.c.height = this.d.length * (this.ts.tw * this.sf);

    this.cxt = <CanvasRenderingContext2D>this.c.getContext('2d');
    this.cxt.imageSmoothingEnabled = false;
    for (var y = 0; y < this.d.length; y++) {
      for (var x = 0; x < this.d[0].length; x++) {
        //TODO: Apply the scale factor during the draw.
        var tile = this.ts.m[this.d[y][x]];
        this.cxt.drawImage(
          this.ts.s,
          tile.c * this.ts.tw,
          tile.r * this.ts.th,
          this.ts.tw,
          this.ts.th,
          x * (this.ts.tw * this.sf),
          y * (this.ts.th * this.sf),
          this.ts.tw * this.sf,
          this.ts.th * this.sf
        );
      }
    }
  }

  setVisible(v: boolean): void {
    this.v = v != this.v ? v : this.v;
  }

  getContext(): CanvasRenderingContext2D {
    return this.cxt;
  }

  draw(cr: Rect, context: CanvasRenderingContext2D): void {
    if (this.v) {
      context.drawImage(this.c, cr.l, cr.t, cr.r - cr.l, cr.b - cr.t, 0, 0, width, height);
    }
  }
}

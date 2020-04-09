import { Rect } from './rect.js';

export class Entity {
  public x: number; // Entity's current position on the X axis, in pixels.
  public y: number; // Entity's current position on the Y axis, in pixels.
  public w: number; // Enitiy's width, in pixels.
  public h: number; // Entity's height, in pixels.
  public a: boolean; // Entity's current active state.

  constructor(x: number, y: number, w: number, h: number, a: boolean = true) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.a = a;
  }

  getRect(): Rect {
    return { l: this.x, t: this.y, r: this.x + this.w, b: this.y + this.h };
  }

  think(): void {}

  update(cr: Rect): void {}

  draw(cr: Rect, context: CanvasRenderingContext2D): void {}

  getX(): number {
    return this.x;
  }

  getY(): number {
    return this.y;
  }
}

import { Entity } from './entity.js';
import { Rect } from './rect.js';

export class ViewPort extends Entity {
  private br: Rect;
  private e: Entity;

  constructor(x: number, y: number, w: number, h: number, br: Rect, e: Entity) {
    console.log('ViewPort()');
    super(x, y, w, h);

    this.br = br; //World Bounding Rect;
    this.e = e; //Entity to track;
  }

  getRect() {
    var l = this.e.x - this.e.w / 2 - this.w / 2;
    if (l < this.br.l) l = this.br.l;
    else if (l > this.br.r - this.w) l = this.br.r - this.w;
    var t = this.e.y - this.e.h / 2 - this.h / 2;
    if (t < this.br.t) t = this.br.t;
    else if (t > this.br.b - this.h) t = this.br.b - this.h;
    var r = l + this.w;
    var b = t + this.h;
    return { l: l, t: t, r: r, b: b };
  }
}

import { Entity } from './entity.js';
import { Person } from './person.js';
import { Rect } from './rect.js';

export class Projectile extends Entity {
  protected br: Rect;
  protected e: Entity;
  protected r: number;
  protected rs: number;
  protected t: number;
  public hp: number;

  constructor(br: Rect, e: Person) {
    super(Math.round(e.getX()), Math.round(e.getY()), 4, 4);

    this.br = br; //World Bounding Rectangle
    this.e = e; //Entity that generated this projectile
    this.r = e.r; //Rotation
    this.rs = e.rs; //Rotation Steps
    this.t = 8; //Projectile Speed
    this.hp = 25; //Projectile hit points
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(cr: Rect): void {
    if (this.a == true) {
      //Calculate Movement
      const radians = this.r * (6.282 / this.rs);

      const xv = this.t * Math.cos(radians);
      const yv = this.t * Math.sin(radians);

      this.x += xv;
      this.y += yv;
    }
  }

  draw(cr: Rect, context: CanvasRenderingContext2D): void {
    if (this.a == true) {
      //Only render if on screen
      if (this.x + this.w >= cr.l && this.y + this.h >= cr.t && this.x <= cr.r + this.w && this.y <= cr.b + this.h) {
        context.fillStyle = 'yellow';
        context.fillRect(this.x - cr.l, this.y - cr.t, this.w, this.h);
      } else {
        this.a = false;
      }
    }
  }
}

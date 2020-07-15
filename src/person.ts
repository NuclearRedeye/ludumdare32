import { Rect } from './rect.js';
import { Entity } from './entity.js';
import { TileSet } from './tile-set.js';
import { State } from './state.js';
import { Game } from './game.js';
import { map_sprites } from './data.js';
import { tile_w, tile_h } from './constants.js';
import { Projectile } from './projectile.js';

export class Person extends Entity {
  protected br: Rect; // World Bounding Rect
  public r: number; // Rotation
  public rs: number; // Rotation Steps
  protected rv: number; // Rotation Velocity
  protected xv: number; // Velocity on X Axis
  protected yv: number; // Velocity on Y Axis
  protected t: number; // Forward Acceleration (Thrust)
  protected ts: number; // Tile Set
  protected af: number; // Animation Frame Counter
  protected hp: number; // Health
  protected shooting: boolean; // Flag to indicate if the entity is shooting or not.
  public states: {
    [key: string]: State;
  };
  protected state: State;
  protected sprites: TileSet;
  protected game: Game;

  constructor(br: Rect, x: number, y: number, w: number, h: number, sprites: TileSet, game: Game) {
    super(x, y, w, h);

    this.br = br;
    this.r = 0;
    this.rs = 16;
    this.rv = 0;
    this.xv = 0;
    this.yv = 0;
    this.t = 0;
    this.ts = 0;
    this.af = 0;
    this.hp = 100;
    this.shooting = false;

    this.states = {
      idle: { frames: [0], r: 0, t: 0, l: true },
      walkback: { frames: [0, 4, 0, 1], r: 0.1, t: -0.8, l: true },
      walk: { frames: [0, 1, 0, 4], r: 0.1, t: 0.8, l: true },
      jog: { frames: [0, 1, 2, 3, 4, 5, 6], r: 0.25, t: 2, l: true },
      sprint: { frames: [0, 1, 2, 3, 4, 5, 6], r: 0.5, t: 5, l: true },
      falling: { frames: [8, 9, 10], r: 0.1, t: 0, l: false },
      dying: { frames: [8, 9, 10], r: 0.1, t: 0, l: false, ns: 'dead' },
      dead: { frames: [10], r: 0.1, t: 0, l: false }
    };

    this.sprites = sprites;
    this.state = this.states.idle;
    this.game = game;

    // TODO: Wonder if this is still needed?
    this.setState(this.state);
  }

  hit(p: Projectile): void {
    this.hp -= p.hp;
    this.game.score += 1;
    if (this.hp < 0) {
      this.setState(this.states.dying);
    } else {
      const ctx = this.game.getWorld().layers[0].getContext();
      const sprite_name = 'splat-0' + (Math.floor(Math.random() * 4) + 1);
      const sprite = map_sprites[sprite_name];
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.r * (6.282 / this.rs));
      ctx.drawImage(
        this.sprites.s,
        sprite.c * this.sprites.tw,
        sprite.r * this.sprites.th,
        this.sprites.tw,
        this.sprites.th,
        -(this.w / 2),
        -(this.h / 2),
        this.w,
        this.h
      );
      ctx.restore();
    }
  }

  getRect(): Rect {
    const l = this.x - 3 * 4;
    const t = this.y - 4 * 4;
    const r = this.x + 3 * 4;
    const b = this.y + 4 * 4;
    return { l: l, t: t, r: r, b: b };
  }

  setState(state: State): void {
    if (this.state != state) {
      this.state = state;
      this.af = 0;
      if (state.t !== undefined) this.t = state.t;

      if (this.state == this.states.dying) {
        const ctx = this.game.getWorld().layers[0].getContext();
        const sprite_name = 'stain-0' + (Math.floor(Math.random() * 4) + 1);
        const sprite = map_sprites[sprite_name];
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.r * (6.282 / this.rs));
        ctx.drawImage(
          this.sprites.s,
          sprite.c * this.sprites.tw,
          sprite.r * this.sprites.th,
          this.sprites.tw,
          this.sprites.th,
          -(this.w / 2),
          -(this.h / 2),
          this.w,
          this.h
        );
        ctx.restore();
      } else if (this.state == this.states.dead) {
        const ctx = this.game.getWorld().layers[0].getContext();
        const sprite_name = 'splat-0' + (Math.floor(Math.random() * 4) + 1);
        const sprite = map_sprites[sprite_name];
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.r * (6.282 / this.rs));
        ctx.drawImage(
          this.sprites.s,
          sprite.c * this.sprites.tw,
          sprite.r * this.sprites.th,
          this.sprites.tw,
          this.sprites.th,
          -(this.w / 2),
          -(this.h / 2),
          this.w,
          this.h
        );
        ctx.drawImage(
          this.sprites.s,
          this.state.frames[Math.floor(this.af)] * this.sprites.tw,
          this.ts * this.sprites.th,
          this.sprites.tw,
          this.sprites.th,
          -(this.w / 2),
          -(this.h / 2),
          this.w,
          this.h
        );
        ctx.restore();
        this.a = false;

        this.game.score += 50;

        // FIXME: This shouldn't be here!
        const w = this.game.getWorld();
        w.addCivilian(this.sprites, this.game);
        w.addZombie(this.sprites, this.game);
      }
    }
  }

  rotate(amount: number): void {
    this.r += amount;
    if (this.r < 0) {
      this.r = this.rs - 1;
    } else if (this.r >= this.rs) {
      this.r = 0;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(cr: Rect): void {
    if (this.a == true) {
      this.rotate(this.rv);

      //Calculate Movement
      const radians = this.r * (6.282 / this.rs);

      this.xv = this.t * Math.cos(radians);
      this.yv = this.t * Math.sin(radians);

      //Calculate new Position
      this.x += this.xv;
      this.y += this.yv;

      //TODO: Check movement is onto a valid tile

      //Don't exceed bounds
      if (this.x < this.br.l) this.x = this.br.l;
      else if (this.x > this.br.r) this.x = this.br.r;
      if (this.y < this.br.t) this.y = this.br.t;
      else if (this.y > this.br.b) this.y = this.br.b;

      //Wind on frame counter, and wrap (TODO: fix the kludge to control speed!)
      this.af += this.state.r;
      if (this.af >= this.state.frames.length) {
        if (this.state.l == true) {
          this.af = 0;
        } else if (this.state.ns !== undefined) {
          this.setState(this.states[this.state.ns]);
        } else {
          this.af = this.state.frames.length - 1;
        }
      }

      if (this.shooting == true) {
        const w = this.game.getWorld();
        w.addProjectile(new Projectile(w.getRect(), this));
      }
    }
  }

  draw(cr: Rect, context: CanvasRenderingContext2D): void {
    if (this.a == true) {
      //Only render if on screen
      if (this.x + this.w >= cr.l && this.y + this.h >= cr.t && this.x <= cr.r + this.w && this.y <= cr.b + this.h) {
        context.save();
        context.translate(this.x - cr.l, this.y - cr.t);
        context.rotate(this.r * (6.282 / this.rs));
        context.drawImage(
          this.sprites.s,
          this.state.frames[Math.floor(this.af)] * tile_w,
          this.ts * tile_h,
          tile_w,
          tile_h,
          -(this.w / 2),
          -(this.h / 2),
          this.w,
          this.h
        );
        context.restore();

        /*
							var r = this.getRect()						
							context.fillStyle = "red";
							context.fillRect(r.l - cr.l, r.t - cr.t, (r.r - r.l), (r.b - r.t));
							*/
      }
    }
  }
}

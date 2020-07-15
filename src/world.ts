/* eslint-disable @typescript-eslint/camelcase */
import { Entity } from './entity.js';
import { Person } from './person.js';
import { Layer } from './layer.js';
import { Civilian } from './civilian.js';
import { Zombie } from './zombie.js';
import { layer01, layer02 } from './map.js';
import { TileSet } from './tile-set.js';
import { tile_sf } from './constants.js';
import { Game } from './game.js';
import { Player } from './player.js';
import { Projectile } from './projectile.js';
import { Rect } from './rect.js';
import { ViewPort } from './viewport.js';

export class World extends Entity {
  private max_entities: number;
  private max_projectiles: number;
  public layers: Layer[];
  private entities: Person[];
  private projectiles: Projectile[];
  public player: Player;
  private viewport: ViewPort;

  constructor(w: number, h: number, tiles: TileSet, sprites: TileSet, game: Game, canvas: HTMLCanvasElement) {
    console.log('World()');
    super(0, 0, w, h);

    this.max_entities = 120;
    this.max_projectiles = 50;

    this.layers = [];
    this.layers.push(new Layer('layer1', layer01, tiles, tile_sf));
    this.layers.push(new Layer('layer2', layer02, sprites, tile_sf));

    this.entities = [];

    for (let i = 0; i < 15; i++) {
      this.entities.push(new Civilian(this.getRect(), sprites, game));
    }

    for (let i = 0; i < 5; i++) {
      this.entities.push(new Zombie(this.getRect(), sprites, game));
    }

    this.player = new Player(this.getRect(), sprites, game);
    this.entities.push(this.player);

    this.projectiles = [];

    this.viewport = new ViewPort(0, 0, canvas.width, canvas.height, this.getRect(), this.player);
  }

  onKeyDown(kc: number): void {
    this.player.onKeyDown(kc);
  }

  onKeyUp(kc: number): void {
    this.player.onKeyUp(kc);
  }

  addProjectile(p: Projectile): void {
    if (this.projectiles.length < this.max_projectiles) {
      this.projectiles.push(p);
    } else {
      for (let i = 0; i < this.projectiles.length; i++) {
        if (this.projectiles[i].a == false) {
          this.projectiles[i] = p;
          break;
        }
      }
    }
  }

  addCivilian(sprites: TileSet, game: Game): void {
    this.addEntity(new Civilian(this.getRect(), sprites, game));
  }

  addZombie(sprites: TileSet, game: Game): void {
    this.addEntity(new Zombie(this.getRect(), sprites, game));
  }

  addEntity(e: Person): void {
    if (this.entities.length < this.max_entities) {
      this.entities.push(e);
    } else {
      for (let i = 0; i < this.entities.length; i++) {
        if (this.entities[i].a == false) {
          this.entities[i] = e;
          break;
        }
      }
    }
  }

  collisionRectCheck(a: Rect, b: Rect): boolean {
    return !(
      Math.round(a.t) > Math.round(b.b) ||
      Math.round(a.b) < Math.round(b.t) ||
      Math.round(a.l) > Math.round(b.r) ||
      Math.round(a.r) < Math.round(b.l)
    );
  }

  update(): void {
    const cr = this.viewport.getRect();

    for (let i = 0; i < this.entities.length; i++) {
      this.entities[i].think();
      this.entities[i].update(cr);
    }

    for (let i = 0; i < this.projectiles.length; i++) {
      this.projectiles[i].update(cr);
    }

    //Check Collisions
    for (let i = 0; i < this.entities.length; i++) {
      // Don't check the player against self
      if (this.entities[i].a == false || this.entities[i] == this.player) continue;

      // Projectiles
      for (let y = 0; y < this.projectiles.length; y++) {
        if (this.projectiles[y].a == true) {
          if (this.collisionRectCheck(this.projectiles[y].getRect(), this.entities[i].getRect())) {
            this.entities[i].hit(this.projectiles[y]);
            this.projectiles[y].a = false;
          }
        }
      }

      if (this.collisionRectCheck(this.player.getRect(), this.entities[i].getRect())) {
        this.entities[i].setState(this.entities[i].states.falling);
      }
    }
  }

  draw(cr: Rect, context: CanvasRenderingContext2D): void {
    const vcr = this.viewport.getRect();

    for (let i = 0; i < this.layers.length; i++) this.layers[i].draw(vcr, context);

    for (let i = 0; i < this.entities.length; i++) this.entities[i].draw(vcr, context);

    for (let i = 0; i < this.projectiles.length; i++) this.projectiles[i].draw(vcr, context);
  }
}

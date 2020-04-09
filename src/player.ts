import { Person } from './person.js';
import { Rect } from './rect.js';
import { Game } from './game.js';
import { TileSet } from './tile-set.js';

export class Player extends Person {
  constructor(br: Rect, sprites: TileSet, game: Game) {
    super(br, br.r / 2, br.b / 2, 64, 64, sprites, game);

    this.rs = 128;
    //this.movement_states = [states.back, states.idle, states.walk, states.jog, states.sprint];
  }

  onKeyDown(kc: number) {
    switch (kc) {
      case 32: //Space
        this.shooting = true;
        break;

      case 38: // Up
        //TODO: Improve this
        this.setState(this.states.sprint);
        break;

      case 37: // Left
        this.rv = -1;
        break;

      case 40: // Down
        //TODO: Improve this
        this.setState(this.states.walkback);
        break;

      case 39: // Right
        this.rv = 1;
        break;

      default:
        console.log('Unhandled Key Event. Code = ' + kc);
        break;
    }
  }

  onKeyUp(kc: number) {
    switch (kc) {
      case 32: //Space
        this.shooting = false;
        break;

      case 38: // Up
      case 40: //Down
        //TODO: Improve this
        this.setState(this.states.idle);
        break;

      case 39: // Right
      case 37: // Left
        this.rv = 0;
        break;
    }
  }
}

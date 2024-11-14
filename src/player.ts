import { Actor, Color, vec } from "excalibur";
import { Resources } from "./resources";

export class Player extends Actor {
  private speed: number = 100;
  private health: number = 100;

  constructor() {
    super({
      pos: vec(150, 150),
      width: 100,
      height: 100
    });
  }

  onInitialize() {
    this.graphics.add(Resources.Player.toSprite());
    this.on('pointerup', () => {
      alert('yo');
    });
  }

  getSpeed() {
    return this.speed;
  }

  getHealth() {
    return this.health;
  }
}

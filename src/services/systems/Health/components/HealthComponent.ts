import { Component } from 'excalibur';

class HealthComponent extends Component {
  private _health: number;
  private _maxHealth: number;

  constructor() {
    super();

    this._health = 1;
    this._maxHealth = 1;
  }

  get health(): number {
    return this._health;
  }

  get maxHealth(): number {
    return this._maxHealth;
  }

  set maxHealth(value: number) {
    this._maxHealth = Math.max(value, 0);
    this._health = Math.min(this._health, this._maxHealth);
  }

  set health(value: number) {
    this._health = Math.min(Math.max(value, 0), this._maxHealth);
  }

  isAlive(): boolean {
    return this._health > 0;
  }
};

export default HealthComponent;
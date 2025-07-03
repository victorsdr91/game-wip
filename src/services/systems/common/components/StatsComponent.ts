import { Component } from "excalibur";
import { StatsEnum } from "./types/stats.enum";

class StatsComponent extends Component {
  private _stats: Record<StatsEnum, number>;

  constructor() {
    super();
    this._stats = this.resetStats();
  }

  get stats(): Record<StatsEnum, number> {
    return this._stats;
  }

  setStat(key: StatsEnum, value: number): void {
    this._stats[key] = value;
  }

  getStat(key: StatsEnum): number {
    return this._stats[key];
  }

  resetStats(): Record<StatsEnum, number> {
    return {
        [StatsEnum.f_attack]: 0,
        [StatsEnum.f_defense]: 0,
        [StatsEnum.m_attack]: 0,
        [StatsEnum.m_defense]: 0,
        [StatsEnum.speed]: 0,
        [StatsEnum.cSpeed]: 0,
        [StatsEnum.agi]: 0,
        [StatsEnum.con]: 0,
        [StatsEnum.f_damage]: 0,
        [StatsEnum.m_damage]: 0,
        [StatsEnum.critical_rate]: 0,
    };
  }
}

export default StatsComponent;
import { Vector } from "excalibur";

export type Skill = {
    id: number;
    name: string;
    description: string;
    icon: string;
    type: SkillType;
    activeType?: ActiveSkillType; // only for active skills
    origin: OriginType;
    cooldownGroup?: string; // group for shared cooldowns
    cooldown: number; // in seconds
    isInCooldown: boolean; // whether the skill is currently on cooldown
    level: number;
    manaCost: number; // mana cost to use the skill
    castTime: number; // time in seconds to cast the skill
    range: number; // range of the skill
    shape: ShapeType; // shape of the skill effect (e.g., circle, cone, line)
    effects: SkillEffect[];
}

export type CurrentSkill = {
    skill: Skill; // the skill being used
    pos?: Vector; // position where the skill is cast
    direction?: number; // angle in radians using entity as center and mouse position as target
    areaOfEffect?: Vector[]; // radius of the area of effect, if applicable
    isExecuted: boolean;
}
export type SkillEffect = {
    effectType: EffectType;
    value: number; // value of the effect, e.g., damage, heal amount, buff value
    duration?: number; // duration of the effect in seconds, if applicable
    tauntMultiplier: number;
}

export enum OriginType {
    Player = "player", // self-targeted skills
    Mouse = "mouse", // skills targeted at mouse position
    Entity = "entity", // skills targeted at an entity (e.g., enemy, ally
}

export enum SkillType {
    Active = "active",
    Passive = "passive",
}

export enum ActiveSkillType {
    Physical = "physical", // physical damage skills
    Magical = "magical", // magical damage skills
    Support = "support", // skills that provide buffs or healing
    CrowdControl = "crowd_control", // skills that control the battlefield (e.g.,
}

export enum EffectType {
    Damage = "damage",
    Heal = "heal",
    Buff = "buff",
    Debuff = "debuff",
    CrowdControl = "crowd_control" // e.g., stun, slow, silence
}

export enum ShapeType {
    Circle = "circle", // circular area of effect
    Cone = "cone", // cone-shaped area of effect
    Rectangle = "rectangle", // line-shaped area of effect
    Line = "line", // straight line area of effect
    Point = "point" // point-blank area of effect
}
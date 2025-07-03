import { ActiveSkillType, EffectType, OriginType, ShapeType, Skill, SkillEffect, SkillType } from "services/systems/Combat/types/skill.type";

const physicalDamageEffect: SkillEffect = {
    value: 10,
    effectType: EffectType.Damage,
    tauntMultiplier: 1
};

export const basicPhysicalSkill: Skill = {
    id: 0,
    name: "Basic Attack",
    description: "A simple attack that deals basic damage.",
    icon: "basic-attack-icon",
    cooldown: 10,
    manaCost: 0,
    level: 1,
    effects: [physicalDamageEffect],
    range: 20,
    castTime: 0,
    type: SkillType.Active,
    activeType: ActiveSkillType.Physical,
    shape: ShapeType.Line,
    origin: OriginType.Player,
    isInCooldown: false
};

export const basicAreaSkill: Skill = {
    id: 0,
    name: "Basic Attack",
    description: "A simple attack that deals basic damage.",
    icon: "basic-attack-icon",
    cooldown: 10,
    manaCost: 0,
    level: 1,
    effects: [physicalDamageEffect],
    range: 35,
    castTime: 0,
    type: SkillType.Active,
    activeType: ActiveSkillType.Physical,
    shape: ShapeType.Rectangle,
    origin: OriginType.Player,
    isInCooldown: false
};

export const basicAreaConeSkill: Skill = {
    id: 0,
    name: "Basic Attack",
    description: "A simple attack that deals basic damage.",
    icon: "basic-attack-icon",
    cooldown: 10,
    manaCost: 0,
    level: 1,
    effects: [physicalDamageEffect],
    range: 50,
    castTime: 0,
    type: SkillType.Active,
    activeType: ActiveSkillType.Physical,
    shape: ShapeType.Cone,
    origin: OriginType.Player,
    isInCooldown: false
};

export const basicAreaRangedSkill: Skill = {
    id: 0,
    name: "Basic Attack",
    description: "A simple attack that deals basic damage.",
    icon: "basic-attack-icon",
    cooldown: 10,
    manaCost: 0,
    level: 1,
    effects: [physicalDamageEffect],
    range: 20,
    castTime: 0,
    type: SkillType.Active,
    activeType: ActiveSkillType.Physical,
    shape: ShapeType.Circle,
    origin: OriginType.Mouse,
    isInCooldown: false
};

export const basicRangedSkill: Skill = {
    id: 0,
    name: "Basic Attack",
    description: "A simple attack that deals basic damage.",
    icon: "basic-attack-icon",
    cooldown: 10,
    manaCost: 0,
    level: 1,
    effects: [physicalDamageEffect],
    range: 20,
    castTime: 0,
    type: SkillType.Active,
    activeType: ActiveSkillType.Physical,
    shape: ShapeType.Point,
    origin: OriginType.Mouse,
    isInCooldown: false
};

export const basicSlimeSkill: Skill = {
    id: 0,
    name: "Slime Attack",
    description: "A simple attack that deals basic damage.",
    icon: "basic-attack-icon",
    isInCooldown: false, // Whether the skill is currently on cooldown
    cooldownGroup: "slimeAttack", // Group for shared cooldowns
    cooldown: 1,
    manaCost: 0,
    level: 1,
    effects: [physicalDamageEffect],
    range: 18,
    castTime: 0,
    type: SkillType.Active,
    activeType: ActiveSkillType.Physical,
    shape: ShapeType.Rectangle,
    origin: OriginType.Entity
};
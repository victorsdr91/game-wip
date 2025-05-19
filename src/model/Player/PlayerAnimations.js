"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerAnimation = void 0;
const excalibur_1 = require("excalibur");
const resources_1 = require("../../resources");
class PlayerAnimation {
    constructor(playerFrameSpeed) {
        this.playerFrameSpeed = playerFrameSpeed;
        this.noActionSpritesheet = this.loadSpriteSheet("Player_Idle_Run_Death_Anim", 13, 8);
        this.attackSpriteSheet = this.loadSpriteSheet("Player_Attack_Anim", 9, 4);
    }
    initialize() {
        this.mapAnimations();
        this.mapAttackAnimations();
    }
    loadSpriteSheet(resource, rows, columns) {
        return excalibur_1.SpriteSheet.fromImageSource({
            image: resources_1.PlayerResources[resource],
            grid: {
                rows,
                columns,
                spriteWidth: 32,
                spriteHeight: 32
            },
            spacing: {
                originOffset: {
                    x: 0, y: 0
                },
                // Optionally specify the margin between each sprite
                margin: { x: 0, y: 0 }
            }
        });
    }
    mapAnimations() {
        let initialRange = 0;
        this.playerAnimations = {
            idle: {
                up: this.noActionSpritesheet.getSprite(0, 2),
                down: this.noActionSpritesheet.getSprite(0, 0),
                left: this.noActionSpritesheet.getSprite(0, 1).clone(),
                right: this.noActionSpritesheet.getSprite(0, 1),
            },
            walk: {
                down: excalibur_1.Animation.fromSpriteSheet(this.noActionSpritesheet, (0, excalibur_1.range)(initialRange, initialRange + 5), this.playerFrameSpeed),
                left: excalibur_1.Animation.fromSpriteSheet(this.noActionSpritesheet, (0, excalibur_1.range)(initialRange += 8, initialRange + 5), this.playerFrameSpeed).clone(),
                right: excalibur_1.Animation.fromSpriteSheet(this.noActionSpritesheet, (0, excalibur_1.range)(initialRange, initialRange + 5), this.playerFrameSpeed),
                up: excalibur_1.Animation.fromSpriteSheet(this.noActionSpritesheet, (0, excalibur_1.range)(initialRange += 8, initialRange + 3), this.playerFrameSpeed),
            },
            run: {
                down: excalibur_1.Animation.fromSpriteSheet(this.noActionSpritesheet, (0, excalibur_1.range)(initialRange += 8, initialRange + 5), this.playerFrameSpeed),
                left: excalibur_1.Animation.fromSpriteSheet(this.noActionSpritesheet, (0, excalibur_1.range)(initialRange += 8, initialRange + 5), this.playerFrameSpeed).clone(),
                right: excalibur_1.Animation.fromSpriteSheet(this.noActionSpritesheet, (0, excalibur_1.range)(initialRange, initialRange + 5), this.playerFrameSpeed),
                up: excalibur_1.Animation.fromSpriteSheet(this.noActionSpritesheet, (0, excalibur_1.range)(initialRange += 8, initialRange + 5), this.playerFrameSpeed),
            },
            die: excalibur_1.Animation.fromSpriteSheet(this.noActionSpritesheet, (0, excalibur_1.range)(initialRange += 8, initialRange + 3), this.playerFrameSpeed, excalibur_1.AnimationStrategy.Freeze),
            damaged: {
                down: excalibur_1.Animation.fromSpriteSheet(this.noActionSpritesheet, (0, excalibur_1.range)(initialRange += 8, initialRange + 3), this.playerFrameSpeed),
                left: excalibur_1.Animation.fromSpriteSheet(this.noActionSpritesheet, (0, excalibur_1.range)(initialRange += 8, initialRange + 3), this.playerFrameSpeed).clone(),
                right: excalibur_1.Animation.fromSpriteSheet(this.noActionSpritesheet, (0, excalibur_1.range)(initialRange, initialRange + 3), this.playerFrameSpeed),
                up: excalibur_1.Animation.fromSpriteSheet(this.noActionSpritesheet, (0, excalibur_1.range)(initialRange += 8, initialRange + 3), this.playerFrameSpeed),
            },
        };
        this.playerAnimations.idle.left.flipHorizontal = true;
        this.playerAnimations.walk.left.flipHorizontal = true;
        this.playerAnimations.run.left.flipHorizontal = true;
        this.playerAnimations.damaged.left.flipHorizontal = true;
    }
    mapAttackAnimations() {
        let initialRange = 0;
        let sideRange = 0;
        this.attackAnimations = {
            down: [
                excalibur_1.Animation.fromSpriteSheet(this.attackSpriteSheet, (0, excalibur_1.range)(initialRange, initialRange += 3), this.playerFrameSpeed),
                excalibur_1.Animation.fromSpriteSheet(this.attackSpriteSheet, (0, excalibur_1.range)(initialRange++, initialRange += 3), this.playerFrameSpeed),
                excalibur_1.Animation.fromSpriteSheet(this.attackSpriteSheet, (0, excalibur_1.range)(initialRange++, initialRange += 3), this.playerFrameSpeed),
            ],
            left: [
                excalibur_1.Animation.fromSpriteSheet(this.attackSpriteSheet, (0, excalibur_1.range)(sideRange += ++initialRange, initialRange += 3), this.playerFrameSpeed).clone(),
                excalibur_1.Animation.fromSpriteSheet(this.attackSpriteSheet, (0, excalibur_1.range)(initialRange++, initialRange += 3), this.playerFrameSpeed).clone(),
                excalibur_1.Animation.fromSpriteSheet(this.attackSpriteSheet, (0, excalibur_1.range)(initialRange++, initialRange += 3), this.playerFrameSpeed).clone(),
            ],
            right: [
                excalibur_1.Animation.fromSpriteSheet(this.attackSpriteSheet, (0, excalibur_1.range)(sideRange, sideRange += 3), this.playerFrameSpeed).clone(),
                excalibur_1.Animation.fromSpriteSheet(this.attackSpriteSheet, (0, excalibur_1.range)(sideRange++, sideRange += 3), this.playerFrameSpeed).clone(),
                excalibur_1.Animation.fromSpriteSheet(this.attackSpriteSheet, (0, excalibur_1.range)(sideRange++, sideRange += 3), this.playerFrameSpeed).clone(),
            ],
            up: [
                excalibur_1.Animation.fromSpriteSheet(this.attackSpriteSheet, (0, excalibur_1.range)(initialRange += 2, initialRange += 3), this.playerFrameSpeed),
                excalibur_1.Animation.fromSpriteSheet(this.attackSpriteSheet, (0, excalibur_1.range)(initialRange++, initialRange += 3), this.playerFrameSpeed),
                excalibur_1.Animation.fromSpriteSheet(this.attackSpriteSheet, (0, excalibur_1.range)(initialRange++, initialRange += 3), this.playerFrameSpeed),
            ]
        };
        this.attackAnimations.left.forEach((value) => { value.flipHorizontal = true; });
    }
    getAttackAnimations() {
        return this.attackAnimations;
    }
    useAttackAnimation(direction, attackMode) {
        return this.attackAnimations[direction][attackMode];
    }
    usePlayerAnimation({ mode, direction }) {
        return this.playerAnimations[mode][direction];
    }
    useDieAnimation() {
        return this.playerAnimations.die;
    }
}
exports.PlayerAnimation = PlayerAnimation;

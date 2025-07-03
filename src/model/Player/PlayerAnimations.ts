import { SpriteSheet, Animation, range, AnimationStrategy, Sprite } from "excalibur";
import { PlayerResources } from "../../resources";
import { AttackPlayerAnimations, PlayerAnimations } from "./contract";
import { useAnimationInput } from "../ExtendedActor/contract";
import { MovementDirection } from "services/systems/Movement/types/movement.enum";


export class PlayerAnimation {
    private noActionSpritesheet: SpriteSheet;
    private attackSpriteSheet: SpriteSheet;
    private playerAnimations!: PlayerAnimations;
    private attackAnimations!: AttackPlayerAnimations;
    private playerFrameSpeed: number;

    constructor(playerFrameSpeed: number) {
        this.playerFrameSpeed = playerFrameSpeed;
        this.noActionSpritesheet = this.loadSpriteSheet("Player_Idle_Run_Death_Anim", 13, 8);
        this.attackSpriteSheet = this.loadSpriteSheet("Player_Attack_Anim", 9, 4);
    }

    initialize() {
        this.mapAnimations();
        this.mapAttackAnimations();
    }

    private loadSpriteSheet(resource: string, rows: number, columns: number): SpriteSheet {
        return SpriteSheet.fromImageSource({
              image: PlayerResources[resource],
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
                  margin: { x: 0, y: 0}
              }
        });
    }

    private mapAnimations() {
        let initialRange = 0;
        this.playerAnimations = {
            idle: {
                up: this.noActionSpritesheet.getSprite(0,2),
                down: this.noActionSpritesheet.getSprite(0,0),
                left: this.noActionSpritesheet.getSprite(0,1).clone(),
                right: this.noActionSpritesheet.getSprite(0,1),
            },
            walk: {
                down: Animation.fromSpriteSheet(this.noActionSpritesheet, range(initialRange, initialRange + 5), this.playerFrameSpeed),
                left: Animation.fromSpriteSheet(this.noActionSpritesheet, range(initialRange+=8, initialRange + 5), this.playerFrameSpeed).clone(),
                right: Animation.fromSpriteSheet(this.noActionSpritesheet, range(initialRange, initialRange + 5), this.playerFrameSpeed),
                up: Animation.fromSpriteSheet(this.noActionSpritesheet, range(initialRange+=8, initialRange + 3), this.playerFrameSpeed),
            },
            run: {
                down: Animation.fromSpriteSheet(this.noActionSpritesheet, range(initialRange+=8, initialRange + 5), this.playerFrameSpeed),
                left: Animation.fromSpriteSheet(this.noActionSpritesheet, range(initialRange+=8, initialRange + 5), this.playerFrameSpeed).clone(),
                right: Animation.fromSpriteSheet(this.noActionSpritesheet, range(initialRange, initialRange + 5), this.playerFrameSpeed),
                up: Animation.fromSpriteSheet(this.noActionSpritesheet, range(initialRange+=8, initialRange + 5), this.playerFrameSpeed),
            },
            die: Animation.fromSpriteSheet(this.noActionSpritesheet, range(initialRange+=8, initialRange + 3), this.playerFrameSpeed, AnimationStrategy.Freeze),
            damaged: {
                down: Animation.fromSpriteSheet(this.noActionSpritesheet, range(initialRange+=8, initialRange + 3), this.playerFrameSpeed),
                left: Animation.fromSpriteSheet(this.noActionSpritesheet, range(initialRange+=8, initialRange + 3), this.playerFrameSpeed).clone(),
                right: Animation.fromSpriteSheet(this.noActionSpritesheet, range(initialRange, initialRange + 3), this.playerFrameSpeed),
                up: Animation.fromSpriteSheet(this.noActionSpritesheet, range(initialRange+=8, initialRange + 3), this.playerFrameSpeed),
            },
        };

        this.playerAnimations.idle.left.flipHorizontal = true;
        this.playerAnimations.walk.left.flipHorizontal = true;
        this.playerAnimations.run.left.flipHorizontal = true;
        this.playerAnimations.damaged.left.flipHorizontal = true;
    }

    private mapAttackAnimations() {
        let initialRange = 0;
        let sideRange = 0;
        this.attackAnimations = {
            down: [
                Animation.fromSpriteSheet(this.attackSpriteSheet, range(initialRange, initialRange+=3), this.playerFrameSpeed),
                Animation.fromSpriteSheet(this.attackSpriteSheet, range(initialRange++, initialRange+=3), this.playerFrameSpeed),
                Animation.fromSpriteSheet(this.attackSpriteSheet, range(initialRange++, initialRange+=3), this.playerFrameSpeed),
            ],
            left: [
                Animation.fromSpriteSheet(this.attackSpriteSheet, range(sideRange+=++initialRange, initialRange+=3), this.playerFrameSpeed).clone(),
                Animation.fromSpriteSheet(this.attackSpriteSheet, range(initialRange++, initialRange+=3), this.playerFrameSpeed).clone(),
                Animation.fromSpriteSheet(this.attackSpriteSheet, range(initialRange++, initialRange+=3), this.playerFrameSpeed).clone(),
            ],
            right: [
                Animation.fromSpriteSheet(this.attackSpriteSheet, range(sideRange, sideRange+=3), this.playerFrameSpeed).clone(),
                Animation.fromSpriteSheet(this.attackSpriteSheet, range(sideRange++, sideRange+=3), this.playerFrameSpeed).clone(),
                Animation.fromSpriteSheet(this.attackSpriteSheet, range(sideRange++, sideRange+=3), this.playerFrameSpeed).clone(),
            ],
            up: [
                Animation.fromSpriteSheet(this.attackSpriteSheet, range(initialRange+=2, initialRange+=3), this.playerFrameSpeed),
                Animation.fromSpriteSheet(this.attackSpriteSheet, range(initialRange++, initialRange+=3), this.playerFrameSpeed),
                Animation.fromSpriteSheet(this.attackSpriteSheet, range(initialRange++, initialRange+=3), this.playerFrameSpeed),
            ]
        };

        this.attackAnimations.left.forEach((value) => { value.flipHorizontal = true});
    }

    public getAttackAnimations(): AttackPlayerAnimations {
        return this.attackAnimations;
    }

    public useAttackAnimation(direction: MovementDirection, attackMode: number): Animation {
        return this.attackAnimations[direction][attackMode];
    }

    public usePlayerAnimation({mode, direction}: useAnimationInput): Animation | Sprite {
        return this.playerAnimations[mode][direction];
    }
    
    public useDieAnimation() {
        return this.playerAnimations.die;
    }
}
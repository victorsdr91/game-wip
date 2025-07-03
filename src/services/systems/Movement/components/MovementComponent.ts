import { Component, Vector } from "excalibur";
import { MovementDirection, MovementMode } from "../types/movement.enum";


export class MovementComponent extends Component {
    private _speed: number;
    private _baseSpeed: number = 256; // Default base speed
    private _mode: MovementMode = MovementMode.IDLE; // Default mode
    private _direction: MovementDirection = MovementDirection.DOWN; // Default direction
    private _originalPosition: Vector;

    constructor(speed: number, originalPosition: Vector = Vector.Zero) {
        super();
        this._speed = speed;
        this._originalPosition = originalPosition;
    }

    get speed(): number {
        return this._speed;
    }

    get baseSpeed(): number {
        return this._baseSpeed;
    }

    set speed(value: number) {
        this._speed = value;
    }
    get mode(): MovementMode {
        return this._mode;
    }
    set mode(value: MovementMode) {
        this._mode = value;
    }
    get direction(): MovementDirection {
        return this._direction;
    }
    set direction(value: MovementDirection) {
        this._direction = value;
    }
    get originalPosition(): Vector {
        return this._originalPosition;
    }

    resetMovement() {
        this._mode = MovementMode.IDLE;
        this._speed = 0;
    }
}
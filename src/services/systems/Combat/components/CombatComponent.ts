import { Component, Vector } from "excalibur";
import { CurrentSkill, ShapeType, Skill } from "../types/skill.type";

export class CombatComponent extends Component {
    private _isInCombat: boolean;
    private _skills: Skill[] = []; // Assuming Skill is defined elsewhere
    private _currentSkill: CurrentSkill | null = null; // Current skill being used

    constructor(skills: Skill[] = []) {
        super();
        this._isInCombat = false;
        this._skills = skills;
    }

    getSkillArea(skill: CurrentSkill): Vector[] {
        const center = skill.pos;
        const directionAngle = skill.direction; // angle in radians using entity as center and mouse position as target
        
        const skillData = skill.skill;
        if (!center || !directionAngle || !skillData) {
            return [];
        }
        const radius = skillData.range;
        const shape = skillData.shape;
        let area: Vector[] = [];
        switch (shape) {
            case ShapeType.Circle:
                return this.getCircleShapeArea(center, radius);
            case ShapeType.Line:
                return this.getLineShapeArea(center, directionAngle, radius);
            case ShapeType.Rectangle:
                return this.getRectangleShapeArea(center, directionAngle, radius);
            case ShapeType.Cone:
                return this.getConeShapeArea(center, directionAngle, radius);
            case ShapeType.Point:
            default:
                area.push(new Vector(center.x, center.y));
                return area;
        }
    }

    private getCircleShapeArea(center: Vector, radius: number): Vector[] {
        const area: Vector[] = [];
        for (let angle = 0; angle < 2 * Math.PI; angle += 0.1) {
            const x = center.x + radius * Math.cos(angle);
            const y = center.y + radius * Math.sin(angle);
            area.push(new Vector(x, y));
        }
        return area;
    }

    private getConeShapeArea(center: Vector, directionAngle: number, radius: number): Vector[] {
        const area: Vector[] = [];
        const coneAngle = Math.PI / 4; // Ángulo del cono (45 grados por defecto, puedes ajustarlo o añadirlo como propiedad del skill)
        const coneRadius = radius; // Longitud del cono
        const halfConeAngle = coneAngle / 2;
        
        // Punto de origen del cono
        area.push(new Vector(center.x, center.y));
        
        // Generar puntos a lo largo del arco del cono
        const steps = 20; // Número de puntos para dibujar el arco
        for (let i = 0; i <= steps; i++) {
            const currentAngle = directionAngle - halfConeAngle + (coneAngle * i / steps);
            const x = center.x + coneRadius * Math.cos(currentAngle);
            const y = center.y + coneRadius * Math.sin(currentAngle);
            area.push(new Vector(x, y));
        }
        
        // Cerrar el cono volviendo al origen
        area.push(new Vector(center.x, center.y));
        return area;
    }

    private getRectangleShapeArea(center: Vector, directionAngle: number, radius: number): Vector[] {
        let area: Vector[] = [];
        const width =radius * 0.5; // Ancho del rectángulo (puedes ajustar este valor o añadirlo como propiedad del skill)
        const length = radius; // Longitud del rectángulo basada en el radio
        
        // Calcular los 4 vértices del rectángulo
        // El rectángulo se extiende desde el centro hacia la dirección del mouse
        const halfWidth = width / 2;
        
        // Vectores perpendiculares para el ancho del rectángulo
        const perpAngle = directionAngle + Math.PI / 2; // Ángulo perpendicular
        const perpX = Math.cos(perpAngle);
        const perpY = Math.sin(perpAngle);
        
        // Vectores de dirección para la longitud
        const dirX = Math.cos(directionAngle);
        const dirY = Math.sin(directionAngle);
        
        // Calcular los 4 vértices del rectángulo
        const vertex1 = new Vector(
            center.x - halfWidth * perpX,
            center.y - halfWidth * perpY
        );
        const vertex2 = new Vector(
            center.x + halfWidth * perpX,
            center.y + halfWidth * perpY
        );
        const vertex3 = new Vector(
            center.x + halfWidth * perpX + length * dirX,
            center.y + halfWidth * perpY + length * dirY
        );
        const vertex4 = new Vector(
            center.x - halfWidth * perpX + length * dirX,
            center.y - halfWidth * perpY + length * dirY
        );
        
        area = [vertex1, vertex2, vertex3, vertex4, vertex1]; // Cerrar el rectángulo
        return area;

    }

    private getLineShapeArea(center: Vector, directionAngle: number, radius: number): Vector[] {
        const area: Vector[] = [];
        const endLineX = center.x + radius * Math.cos(directionAngle);
        const endLineY = center.y + radius * Math.sin(directionAngle);
        area.push(new Vector(center.x, center.y)); // Start point
        area.push(new Vector(endLineX, endLineY)); // End point
        // Optionally, you can add more points along the line if needed
        
        return area;
    }

    get isInCombat(): boolean {
        return this._isInCombat;
    }

    set isInCombat(value: boolean) {
        this._isInCombat = value;
    }
    get skills(): Skill[] {
        return this._skills;
    }
    set skills(value: Skill[]) {
        this._skills = value;
    }
    get currentSkill(): CurrentSkill | null {
        return this._currentSkill;
    }
    set currentSkill(skill: CurrentSkill | null) {
         this._currentSkill = null;
        if(skill) {
            this._currentSkill = skill;
            this._currentSkill.areaOfEffect = this.getSkillArea(skill);
        }
    }
    executeSkill() {
        if (this._currentSkill) {
            this._currentSkill.isExecuted = true;
        }
    }
    addSkill(skill: Skill): void {
        if (!this._skills.includes(skill)) {
            this._skills.push(skill);
        }
    }
    removeSkill(skill: Skill): void {
        const index = this._skills.indexOf(skill);
        if (index > -1) {
            this._skills.splice(index, 1);
        }
    }
}
import { Color, Point } from "pixi.js";

export interface BubbleInitData {
    scale: number;
    position: Point;
}

export interface RockBubbleInitData extends BubbleInitData {
    life: number;
}

export interface ColorBubbleInitData extends BubbleInitData {
    color: Color;
}

export interface BubbleData {
}

export interface RockBubbleData extends BubbleData {
    life: number;
}

export interface ColorBubbleData extends BubbleData {
    color: string;
}


import { Color, Point } from "pixi.js";


export interface IRuntimeScoreUpdateInfo {
    scoreGained: number;
    scoreGainPosition: Point;
    scoreStripeColor: Color;
    bubbleRadius: number;
}

import { Point } from "pixi.js";
import { BubbleType } from "./model/LayoutInterface";
import { TileContent, TileIndex, WeaponBubbleActedTiles, TileGridContents } from "../../types/BubbleGridInterfaces";

export interface ScoreInfo {
    forPlacing: number;
    impact: number;
    falling: number;
    total: number;
}

export interface IWeaponBubbleImpactInfo {
    weaponBubbleContent?: TileContent;
    trajectoryInfo: ITrajectoryInfo;
    weaponBubbleTileIndex: TileIndex;
    weaponBubbleType: BubbleType;
    weaponBubbleColor: string;
    weaponBubbleActedTiles: WeaponBubbleActedTiles;
    fallingBubbles: TileGridContents;
    score: ScoreInfo
}

export interface ITrajectoryInfo {
    predictedBubbleMovement: Point[];
    weaponBubbleDestinationPosition: Point;
}
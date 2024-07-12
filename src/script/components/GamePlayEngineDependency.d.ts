import { Point } from "pixi.js";
import { Rect } from "./bubbleLayout/controllers/layoutMovement/DynamicBubbleLayoutMovementController";
import { DynamicBubbleLayout } from "./bubbleLayout/DynamicBubbleLayout";
import { BubbleFactoryController } from "./bubbleLayout/model/BubbleFactoryController";
import WeaponBubble from "./WeaponBubble";

export interface IGameModelDependency {
    convertBubbleLayerToGameLayer: (pos: Point) => Point;
    convertGameLayerToBubbleLayer: (pos: Point) => Point;
    getLastVisibleRowIndex: () => number;
    getFirstVisibleRowIndex: () => number;
    radiusOfBubble: number;
    bubbleLayerBoundaryRect: Rect;
    bubbleLayoutLayer: DynamicBubbleLayout;
    getActiveWeaponBubble: () => WeaponBubble;
    bubbleFactoryController: BubbleFactoryController;
}

export interface ITrajectoryInfoDependency {
    convertBubbleLayerToGameLayer: (pos: Point) => Point;
    convertGameLayerToBubbleLayer: (pos: Point) => Point;
    getLastVisibleRowIndex: () => number;
    getFirstVisibleRowIndex: () => number;
    radiusOfBubble: number;
    getActiveWeaponBubble: () => WeaponBubble;
    bubbleLayerBoundaryRect: Rect;
}

export interface ITurnStartInfo {
    turnDuration: number;
    isCurrentPlayer: boolean;
    currentRound: number;
    isStartOfRound: boolean;
}
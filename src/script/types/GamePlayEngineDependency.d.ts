import { Container, Point, Size } from "pixi.js";
import { DynamicBubbleLayout } from "../components/bubbleLayout/DynamicBubbleLayout";
import { BubbleFactoryController } from "../components/bubbleLayout/model/BubbleFactoryController";
import WeaponBubble from "../components/WeaponBubble";
import { TileGrid, TileData } from "./BubbleGridInterfaces";
import BubbleShooterGamePlayModel from "../model/BubbleShooterGamePlayModel";

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

export interface ILayerSize{
    width:number;
    height:number;
}

export interface Rect{
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface ICannonUIIDependencies {
    isFullTrajectory: boolean,
    radiusOfBubble: number,
    layerSize: Size,
    tilesInGrid: TileGrid,
    convertGameLayerToBubbleLayer: (pos: Point) => Point,
    showVisualRepOfWeaponBubble: (pos: Point, data: TileData) => void,
    disableVisualRepOfWeaponBubble: () => void,
    layoutNode: Container,
    gameModel: BubbleShooterGamePlayModel,
    bubbleScaleFactor: number,
}
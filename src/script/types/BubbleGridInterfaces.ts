import { Color, Container, Point } from "pixi.js";
import { BubbleModel } from "../components/bubbleLayout/model/BubbleModel";
import { BubbleType } from "../components/bubbleLayout/model/LayoutInterface";

export interface TileIndex {
    column: number;
    row: number;
}

export interface TileData {
    type: BubbleType;
    color?: string;
}

export interface TileGridContents {
    bubbles: TileIndex[];
}

export type TileGrid = Map<number, Tile[]>;

export enum TileStatus {
    EMPTY,
    OCCUPIED,
}

export interface Tile {
    tileIndex: TileIndex;
    tileStatus: TileStatus;
    position: Point;
    content?: TileContent;
    isRenderedOnGrid: boolean;
}


export interface TileContent {
    type: BubbleType;
    data: BubbleContent;
}

export enum SpecialBubbleType {
    ROCK = "ROCK",
}
export interface SpecialBubbleContent extends BubbleContent {
    type: SpecialBubbleType;
}

export interface BubbleContent {
    model: BubbleModel;
    ui: IBubbleSprite;
}


export interface ColorBubbleActedTiles {
    allBubblesNearby: TileIndex[];
    colorBubbles: TileIndex[];
    specialBubbles: TileIndex[];
}



export interface IBubbleSprite {
    setScale(scale: number): void;
    setWorldPosition(position: Point): void;
    getWorldPosition(): Point;
    execute(data: IBubbleExecutionData): Promise<boolean>;
    setColor(color: Color): void;
    node: Container;
}

export interface IBubbleExecutionData {

}

export type WeaponBubbleActedTiles = ColorBubbleActedTiles;

import { Container, Size } from "pixi.js";
import { BubbleFactoryController } from "../model/BubbleFactoryController";
import { TileIndex, TileContent, TileGrid } from "../../../types/BubbleGridInterfaces";
import TileGridModel from "../model/TileGridModel";
import { IBubbleDropControllerDependency } from "./drop/BubbleDropController";
import { IDynamicBubbleLayoutMovementControllerDependency } from "./layoutMovement/DynamicBubbleLayoutMovementController";
import { IWeaponBubbleFinalPosVisualControllerDependency } from "./trajectory/WeaponBubbleFinalPosVisualController";
import { IWeaponBubbleUIImpactControllerDependency } from "./weaponBubbleImpact/WeaponBubbleUIImpactControllerBase";
import { StageAnimationLayer } from "../animation/StageAnimationLayer";
import { ObserverHandler } from "../ObserverHandler";

export default class DynamicBubbleLayoutDependencyController {
    init(addBubbleToGrid: (tileIndex: TileIndex, bubbleContent: TileContent) => void,
        removeBubbleFromTileIndex: (tileIndex: TileIndex) => void,
        getTiles: () => TileGrid,
        getVisibleTiles: () => TileGrid,
        layoutNode: Container,
        renderBubbleLayoutContent: (fromRow: number, toRow: number) => void,
        getTileGridModel: () => TileGridModel,
        percentageOfBubbleVisibleInTopRow: number,
        radiusOfBubble: number,
        topPadding: number, layerSize: Size, animationLayer: StageAnimationLayer,
        bubbleFactory: BubbleFactoryController,
        bubbleScaleFactor: number, runtimeTempScoreUpdateObserver: ObserverHandler
    ) {
        this.addBubbleToGrid = addBubbleToGrid;
        this.removeBubbleFromTileIndex = removeBubbleFromTileIndex;
        this.getTiles = getTiles;
        this.getVisibleTiles = getVisibleTiles;
        this.layoutNode = layoutNode;
        this.renderBubbleLayoutContent = renderBubbleLayoutContent;
        this.getTileGridModel = getTileGridModel;
        this.percentageOfBubbleVisibleInTopRow = percentageOfBubbleVisibleInTopRow;
        this.radiusOfBubble = radiusOfBubble;
        this.topPadding = topPadding;
        this.layerSize = layerSize;
        this.animationLayer = animationLayer;
        this.bubbleFactory = bubbleFactory;
        this.bubbleScaleFactor = bubbleScaleFactor;
        this.runtimeTempScoreUpdateObserver = runtimeTempScoreUpdateObserver;
    }

    getWeaponBubbleUIImpactControllerDeps(): IWeaponBubbleUIImpactControllerDependency {
        return {
            addBubbleToGrid: this.addBubbleToGrid,
            removeBubbleFromTileIndex: this.removeBubbleFromTileIndex,
            getTiles: this.getTiles,
            layoutNode: this.layoutNode,
            runtimeTempScoreUpdateObserver: this.runtimeTempScoreUpdateObserver,
        }
    }

    getLayoutMovementControllerDeps(): IDynamicBubbleLayoutMovementControllerDependency {
        return {
            getTiles: this.getTiles,
            layerSize: this.layerSize,
            layoutNode: this.layoutNode,
            renderBubbleLayoutContent: this.renderBubbleLayoutContent,
            getTileGridModel: this.getTileGridModel,
            percentageOfBubbleVisibleInTopRow: this.percentageOfBubbleVisibleInTopRow,
            radiusOfBubble: this.radiusOfBubble,
            topPadding: this.topPadding,

        }
    }

    getBubbleDropControllerDeps(): IBubbleDropControllerDependency {
        return {
            animationLayer: this.animationLayer,
            tileGridModel: this.getTileGridModel(),
            radiusOfBubble: this.radiusOfBubble,
            node: this.layoutNode,
            removeBubbleFromTileIndex: this.removeBubbleFromTileIndex,
            getVisibleTiles: this.getVisibleTiles
        }
    }

    getWeaponBubbleFinalPosVisualControllerDeps(): IWeaponBubbleFinalPosVisualControllerDependency {
        return {
            layoutNode: this.layoutNode,
            layerSize: this.layerSize,
            tileGridModel: this.getTileGridModel(),
            bubbleScaleFactor: this.bubbleScaleFactor,
            getTileGridModel: this.getTileGridModel,
            bubbleFactory: this.bubbleFactory,
        }
    }

    private addBubbleToGrid: (tileIndex: TileIndex, bubbleContent: TileContent) => void;
    private removeBubbleFromTileIndex: (tileIndex: TileIndex) => void;
    private getTiles: () => TileGrid;
    private getVisibleTiles: () => TileGrid;
    private bubbleFactory: BubbleFactoryController;
    private layerSize: Size;
    private layoutNode: Container;
    private renderBubbleLayoutContent: (fromRow: number, toRow: number) => void;
    private getTileGridModel: () => any;
    private percentageOfBubbleVisibleInTopRow: number;
    private radiusOfBubble: number;
    private topPadding: number;
    private animationLayer: StageAnimationLayer;
    private bubbleScaleFactor: number;
    private runtimeTempScoreUpdateObserver: ObserverHandler;
}
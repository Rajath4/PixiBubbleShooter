import { Container, Point, Size } from "pixi.js";
import { DynamicBubbleLayout } from "./components/bubbleLayout/DynamicBubbleLayout";
import { BubbleFactoryController } from "./components/bubbleLayout/model/BubbleFactoryController";
import BubbleShooterGamePlayModel from "./components/BubbleShooterGamePlayModel";
import { CannonContainer, ICannonUIIDependencies } from "./components/Cannon";
import { IGameModelDependency } from "./components/GamePlayEngineDependency";

export default class StageGamePlayLayerDependencyProvider {
    init(layoutNode: Container, bubbleLayoutLayer: DynamicBubbleLayout, cannon: CannonContainer, model: BubbleShooterGamePlayModel, layerSize: Size, convertBubbleLayerToGameLayer: (pos: Point) => Point, convertGameLayerToBubbleLayer: (pos: Point) => Point, bubbleFactoryController: BubbleFactoryController) {
        this.layoutNode = layoutNode;
        this.bubbleLayoutLayer = bubbleLayoutLayer;
        this.cannon = cannon;
        this.model = model;
        this.layerSize = layerSize;
        this.convertBubbleLayerToGameLayer = convertBubbleLayerToGameLayer;
        this.convertGameLayerToBubbleLayer = convertGameLayerToBubbleLayer;
        this.bubbleFactoryController = bubbleFactoryController;
    }

    getGameModelDependency(): IGameModelDependency {
        return {
            bubbleLayoutLayer: this.bubbleLayoutLayer,
            convertGameLayerToBubbleLayer: this.convertGameLayerToBubbleLayer.bind(this),
            convertBubbleLayerToGameLayer: this.convertBubbleLayerToGameLayer.bind(this),
            radiusOfBubble: this.bubbleLayoutLayer.radiusOfBubble,
            bubbleLayerBoundaryRect: this.bubbleLayoutLayer.layoutVisibilityController.bubbleLayerBoundaryRect,
            getActiveWeaponBubble: this.cannon.getActiveWeaponBubble.bind(this.cannon),
            getFirstVisibleRowIndex: this.bubbleLayoutLayer.layoutVisibilityController.getFirstVisibleRowIndex,
            getLastVisibleRowIndex: this.bubbleLayoutLayer.layoutVisibilityController.getLastVisibleRowIndex,
            bubbleFactoryController: this.bubbleFactoryController,
        };
    }

    getCannonDependency(): ICannonUIIDependencies {
        return {
            bubbleScaleFactor: this.bubbleLayoutLayer.bubbleScaleFactor,
            gameModel: this.model,
            isFullTrajectory: true,
            layoutNode: this.layoutNode,
            layerSize: this.layerSize,
            radiusOfBubble: this.bubbleLayoutLayer.radiusOfBubble,
            tilesInGrid: this.bubbleLayoutLayer.tiles,
            convertGameLayerToBubbleLayer: this.convertGameLayerToBubbleLayer.bind(this),
            showVisualRepOfWeaponBubble: this.bubbleLayoutLayer.weaponBubbleFinalPosVisualController.showVisualRepOfWeaponBubble,
            disableVisualRepOfWeaponBubble: this.bubbleLayoutLayer.weaponBubbleFinalPosVisualController.disableVisualRepOfWeaponBubble,
        };
    }

    private bubbleLayoutLayer: DynamicBubbleLayout;
    private bubbleFactoryController: BubbleFactoryController;
    private cannon: CannonContainer;
    private model: BubbleShooterGamePlayModel;
    private layerSize: Size = null;
    private layoutNode: Container = null;
    private convertBubbleLayerToGameLayer: (pos: Point) => Point;
    private convertGameLayerToBubbleLayer: (pos: Point) => Point;
}
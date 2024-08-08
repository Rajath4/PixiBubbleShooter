
import { Size } from 'pixi.js';
import { IWeaponBubbleImpactInfo } from './GamePlayEngineModelInterfaces';
import { ObserverHandler } from './ObserverHandler';
import { StaticBubbleLayout } from './StaticBubbleLayout';
import { StageAnimationLayer } from './animation/StageAnimationLayer';
import DynamicBubbleLayoutDependencyController from './controllers/DynamicBubbleLayoutDependencyController';
import NeighborsBubbleShakingController from './controllers/NeighborsBubbleShakingController';
import BubbleDropController from './controllers/drop/BubbleDropController';
import DynamicBubbleLayoutMovementController from './controllers/layoutMovement/DynamicBubbleLayoutMovementController';
import WeaponBubbleFinalPosVisualController from './controllers/trajectory/WeaponBubbleFinalPosVisualController';
import WeaponBubbleUIImpactController from './controllers/weaponBubbleImpact/WeaponBubbleUIImpactController';
import { BubbleFactoryController } from './model/BubbleFactoryController';
import { TileContent, TileData, TileGrid, TileGridContents, TileIndex } from './model/TileGrid';
import TileGridModel from './model/TileGridModel';

export class DynamicBubbleLayout extends StaticBubbleLayout {
    animationLayer: StageAnimationLayer = new StageAnimationLayer();

    percentageOfBubbleVisibleInTopRow = 0.01;

    topPadding = 100;

    initLayout(layoutPrefilledContentData: TileData[][], isStartWithShifted: boolean, layerSize: Size, tileGridModel: TileGridModel, bubbleFactoryController: BubbleFactoryController, runtimeTempScoreUpdateObserver: ObserverHandler) {
        super.init(layoutPrefilledContentData, isStartWithShifted, layerSize, tileGridModel, bubbleFactoryController);

        this.weaponBubbleUIImpactController = new WeaponBubbleUIImpactController();
        this._layoutVisibilityController = new DynamicBubbleLayoutMovementController();
        this._weaponBubbleFinalPosVisualController = new WeaponBubbleFinalPosVisualController();
        this._bubbleDropController = new BubbleDropController();
        this.depController = new DynamicBubbleLayoutDependencyController();
        this.runtimeTempScoreUpdateObserver = new ObserverHandler();


        this.runtimeTempScoreUpdateObserver = runtimeTempScoreUpdateObserver;

        this.depController.init(this.addBubbleToGrid.bind(this), this.removeBubbleFromTileIndex.bind(this),
            this.getTiles.bind(this), this.getTiles.bind(this),
            this, this.renderBubbleLayoutContent.bind(this), this.getTileGridModel.bind(this),
            this.percentageOfBubbleVisibleInTopRow, this.radiusOfBubble, this.topPadding,
            this.layerSize, this.animationLayer, this.bubbleFactoryController, this.bubbleScaleFactor, this.runtimeTempScoreUpdateObserver);


        this.animationLayer.init(this.layerSize);
        this.addChild(this.animationLayer);

        this._neighborsBubbleShakingController = new NeighborsBubbleShakingController(this.tileGridModel.getTile, this.tiles, this.isStartWithShifted);
        this.weaponBubbleUIImpactController.init(this.depController.getWeaponBubbleUIImpactControllerDeps());
        this.layoutVisibilityController.init(this.depController.getLayoutMovementControllerDeps());
        this.bubbleDropController.init(this.depController.getBubbleDropControllerDeps());
        this.weaponBubbleFinalPosVisualController.init(this.depController.getWeaponBubbleFinalPosVisualControllerDeps());

        this.renderInitialLayout(this.layoutVisibilityController.totalBubbleRowsToDisplay + 1);
        this.layoutVisibilityController.setup();
    }

    /**
    * Removes bubble from specified row and column
    * @param {Number} row Row at which we need to remove bubble from layout
    * @param {Number} column Column at which we need to remove from layout
    */
    removeBubbleFromTileIndex(tileIndex: TileIndex) {
        const bubbleToRemove = this.tiles.get(tileIndex.row)[tileIndex.column];
        bubbleToRemove.content.data.ui.node.destroy(); //TODO: POOL ME
        this.tileGridModel.emptyTile(tileIndex);
    }

    /**
     * It will add a bubble of specified type in specified row and column
     *
     * @param {Number} row Row of the bubble in grid
     * @param {Number} column Column of the bubble in grid
     * @param {String} bubbleColor Bubble Color of the bubble
     */
    addBubbleToGrid(tileIndex: TileIndex, bubbleContent: TileContent) {
        const tile = this.tileGridModel.getTile(tileIndex);
        this.tileGridModel.updateTileContent(tileIndex, bubbleContent);
        this.addTileContentToGridUI(tile);
    }

    getTileByIndex = (tileIndex: TileIndex) => {
        return this.tiles.get(tileIndex.row)[tileIndex.column];
    }

    getAllVisibleTiles = () => {
        const visibleTiles: TileGrid = new Map();
        for (let i = this.layoutVisibilityController.getFirstVisibleRowIndex(); i < this.layoutVisibilityController.getLastVisibleRowIndex(); i++) {
            visibleTiles.set(i, this.tiles.get(i));
        }
        return visibleTiles;
    }

    async onWeaponBubbleMovementComplete(weaponBubbleImpactInfo: IWeaponBubbleImpactInfo) {
        if (this.isInvalidBubblePlacement(weaponBubbleImpactInfo)) {
            return Promise.resolve(true);
        }
        // this.neighborsBubbleShakingController.perform(weaponBubbleImpactInfo.weaponBubbleTileIndex, weaponBubbleImpactInfo.trajectoryInfo.weaponBubbleDestinationPosition, this.layoutVisibilityController.getFirstVisibleRowIndex());
        await this.weaponBubbleUIImpactController.performWeaponBubbleTask(weaponBubbleImpactInfo);
        this.removeFloatingBubble(weaponBubbleImpactInfo.fallingBubbles);
    }

    async removeFloatingBubble(fallingBubbles: TileGridContents) {
        this.bubbleDropController.removeFloatingBubble(fallingBubbles);
    }

    /**
     * Use this function to remove the cluster of color bubbles formed as a combo in the layout.
     * @param {any} bubbleCluster:TileIndex[]
     * @returns {any}
     */
    async removeColorBubbleCluster(bubbleCluster: TileIndex[]) {
        return this.weaponBubbleUIImpactController.removeColorBubbleCluster(bubbleCluster);
    }

    private isInvalidBubblePlacement(weaponBubbleImpactInfo: IWeaponBubbleImpactInfo) {
        const finalDestinationPoint = weaponBubbleImpactInfo.trajectoryInfo.predictedBubbleMovement[weaponBubbleImpactInfo.trajectoryInfo.predictedBubbleMovement.length - 1];
        if (this.tileGridModel.heightOfEachTile + this.layerSize.height <= finalDestinationPoint.y) {
            console.log("Bubble wasted");
            return true;
        } else {
            return false;
        }
    }

    private getTiles(): TileGrid {
        return this.tiles;
    }

    private get neighborsBubbleShakingController(): NeighborsBubbleShakingController {
        return this._neighborsBubbleShakingController;
    }

    get layoutVisibilityController(): DynamicBubbleLayoutMovementController {
        return this._layoutVisibilityController;
    }

    get weaponBubbleFinalPosVisualController(): WeaponBubbleFinalPosVisualController {
        return this._weaponBubbleFinalPosVisualController;
    }

    private get bubbleDropController(): BubbleDropController {
        return this._bubbleDropController;
    }

    async onGameOver() {
        await this.bubbleDropController.dropRemainingBubbles();
    }

    private _neighborsBubbleShakingController: NeighborsBubbleShakingController = null;
    private weaponBubbleUIImpactController: WeaponBubbleUIImpactController = null;
    private _layoutVisibilityController: DynamicBubbleLayoutMovementController = null;
    private _weaponBubbleFinalPosVisualController: WeaponBubbleFinalPosVisualController = null;
    private _bubbleDropController: BubbleDropController = null;
    private depController: DynamicBubbleLayoutDependencyController = null;
    private runtimeTempScoreUpdateObserver: ObserverHandler = null;
}

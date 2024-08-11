import { Container, Size } from "pixi.js";
import { TileStatus, TileGrid } from "../../../../types/BubbleGridInterfaces";
import TileGridModel from "../../model/TileGridModel";
import { Rect } from "../../../../types/GamePlayEngineDependency";


export default class DynamicBubbleLayoutMovementController {
    init(dependency: IDynamicBubbleLayoutMovementControllerDependency) {
        this.getTiles = dependency.getTiles;
        this.layerSize = dependency.layerSize;
        this.layoutNode = dependency.layoutNode;
        this.renderBubbleLayoutContent = dependency.renderBubbleLayoutContent;
        this.getTileGridModel = dependency.getTileGridModel;
        this.percentageOfBubbleVisibleInTopRow = dependency.percentageOfBubbleVisibleInTopRow;
        this.radiusOfBubble = dependency.radiusOfBubble;
        this.topPadding = dependency.topPadding;
    }

    setup() {
        // this.layoutNode.setPosition(0, this.layerSize.height);

        this.updateVisibleRowIndex();
        this.moveToBubbleRow(this.totalBubbleRowsToDisplay);

        this.updateBubbleLayoutBoundingBox();
    }

    private updateBubbleLayoutBoundingBox() {
        this._bubbleLayerBoundaryRect = {
            x: this.radiusOfBubble,
            y: this.radiusOfBubble,
            width: this.layerSize.width - 2 * this.radiusOfBubble,
            // height: this.layerSize.height - (this.uiLayer.HUDPanel.getHeight() + 2 * this.bubbleLayoutLayer.radiusOfBubble),
            height: this.layerSize.height - (this.topPadding + (1.01 * this.radiusOfBubble)),
        };
    }


    private moveToBubbleRow(row: number) {
        return new Promise((resolve, reject) => {
            const bubbleLayoutFinalPos = this.layerSize.height - (this.getTiles().get(row)[0].position.y - this.radiusOfBubble + this.percentageOfBubbleVisibleInTopRow * this.radiusOfBubble + this.topPadding);
            const gamePlayInitAnimationDuration = 0.5;

            // tween(this.layoutNode)
            //     .to(gamePlayInitAnimationDuration, { position: new Vec3(0, bubbleLayoutFinalPos, 0) },
            //         { easing: 'backOut' })
            //     .call(() => {
            //         resolve(true);
            //     })
            //     .start();
        });
    }


    switchRowIfNeeded() {
        this.updateVisibleRowIndex();
        const lastVisibleRowIndex = this.getLastVisibleRowIndex();
        const lastRowNeedToRender = lastVisibleRowIndex + 1;

        if (!this.getTileGridModel().isTileRowAvailable(lastRowNeedToRender)) {
            this.getTileGridModel().addTilesTillRow(lastRowNeedToRender);
        }

        const maxRenderedRowIndex = this.getTileGridModel().getMaxRenderedRowIndex();
        if (lastRowNeedToRender > maxRenderedRowIndex) {
            this.renderBubbleLayoutContent(maxRenderedRowIndex + 1, lastRowNeedToRender);
        }
        return this.moveToBubbleRow(lastVisibleRowIndex);
    }

    getFirstVisibleRowIndex = () => {
        return this.firstVisibleRow;
    }

    getLastVisibleRowIndex = () => {
        return this.lastVisibleRow;
    }

    private updateVisibleRowIndex() {
        const getFirstVisibleRow = () => {
            const rowsToCheck = Array.from(this.getTiles().keys()).sort((a, b) => a - b);
            for (const row of rowsToCheck) {
                const rowContents = this.getTiles().get(row);
                if (rowContents.some(tile => tile.tileStatus != TileStatus.EMPTY)) {
                    return row;
                }
            }
        }

        this.firstVisibleRow = getFirstVisibleRow();
        this.lastVisibleRow = 0;
    }

    get bubbleLayerBoundaryRect() {
        return this._bubbleLayerBoundaryRect;
    }

    get totalBubbleRowsToDisplay() {
        return this._totalBubbleRowsToDisplay;
    }

    private _totalBubbleRowsToDisplay = 10;

    private firstVisibleRow: number;
    private lastVisibleRow: number;

    private _bubbleLayerBoundaryRect:Rect = null;

    private getTiles: () => TileGrid;
    private layerSize: Size;
    private layoutNode: Container;
    private renderBubbleLayoutContent: (fromRow: number, toRow: number) => void;
    private getTileGridModel: () => TileGridModel;
    private percentageOfBubbleVisibleInTopRow: number;
    private radiusOfBubble: number;
    private topPadding: number;
}

export interface IDynamicBubbleLayoutMovementControllerDependency {
    getTiles: () => TileGrid;
    layerSize: Size;
    layoutNode: Container;
    renderBubbleLayoutContent: (fromRow: number, toRow: number) => void;
    getTileGridModel: () => TileGridModel;
    percentageOfBubbleVisibleInTopRow: number;
    radiusOfBubble: number;
    topPadding: number;
}
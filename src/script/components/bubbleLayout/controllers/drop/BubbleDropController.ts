import { Container } from "pixi.js";
import { StageAnimationLayer } from "../../animation/StageAnimationLayer";
import { BubbleSprite } from "../../model/BubbleSprite";
import { TileGridContents, TileIndex, TileStatus, TileGrid, IBubbleSprite } from "../../model/TileGrid";
import TileGridModel from "../../model/TileGridModel";
import { BubbleParticleFactory } from "../BubbleParticleFactory";


export default class BubbleDropController {
    init(dependency: IBubbleDropControllerDependency) {
        this.animationLayer = dependency.animationLayer;
        this.tileGridModel = dependency.tileGridModel;
        this.radiusOfBubble = dependency.radiusOfBubble;
        this.node = dependency.node;
        this.removeBubbleFromTileIndex = dependency.removeBubbleFromTileIndex;
        this.getVisibleTiles = dependency.getVisibleTiles;
        this.bubbleParticleFactory = dependency.bubbleParticleFactory;
        this.particleEffectLayer = dependency.particleEffectLayer;
    }

    /**
       * It will remove the floating bubble from specified location
       * @param {Array} floatingBubbles Contains a list of row and columns where Bubble should be removed
       */
    async removeFloatingBubble(fallingInfo: TileGridContents) {
        let bubblesToDrop: BubbleSprite[] = this.getBubbleSprites(fallingInfo.bubbles);

        if (bubblesToDrop.length > 0) {
            await this.animationLayer.initBubbleDropping(bubblesToDrop, this.radiusOfBubble);
        }
    }

    private getBubbleSprites(bubbles: TileIndex[]) {
        let bubblesToDrop: BubbleSprite[] = [];

        for (const floatingBubble of bubbles) {
            const tile = this.getVisibleTiles().get(floatingBubble.row)[floatingBubble.column];
            if (tile.tileStatus !== TileStatus.EMPTY) {
                const bubbleSprite = tile.content.data.ui;
                bubbleSprite.setWorldPosition(bubbleSprite.getWorldPosition());
                bubblesToDrop.push(bubbleSprite as BubbleSprite);
                this.tileGridModel.emptyTile(floatingBubble);
            } else {
                throw new Error("Tile is empty");
            }
        }

        return bubblesToDrop;
    }



    /**
     * It will drop all ColorBubble in the layout
     */
    async dropRemainingBubbles() {
        const allTiles = Array.from(this.getVisibleTiles().values()).flat();

        // Filter Tiles with non-null sprite
        const filteredTiles = allTiles.filter(tile => tile.tileStatus !== TileStatus.EMPTY);

        let bubblesToDrop: TileIndex[] = filteredTiles.map(tile => tile.tileIndex);

        // const bubblesSpritesToDrop: BubbleSprite[] = this.getBubbleSprites(bubblesToDrop);
        const bubblesSpritesToDrop:BubbleSprite[] = [];
        for (const bubbleSprite of bubblesSpritesToDrop) {
            await delay(Math.random() * 0.01, bubbleSprite);
            this.animationLayer.showBubbleDroppingAndBouncing(bubbleSprite, this.radiusOfBubble);
        }

        await delay(2, this.animationLayer); //Wait until all bubbles are dropped
    }

    private animationLayer: StageAnimationLayer;
    private tileGridModel: TileGridModel;
    private radiusOfBubble: number;
    private node: Container;
    private removeBubbleFromTileIndex: (tileIndex: TileIndex) => void;
    private getVisibleTiles: () => TileGrid;
    private bubbleParticleFactory: BubbleParticleFactory;
    private particleEffectLayer: Container;
}

export interface IBubbleDropControllerDependency {
    animationLayer: StageAnimationLayer;
    tileGridModel: TileGridModel;
    radiusOfBubble: number;
    node: Container;
    removeBubbleFromTileIndex: (tileIndex: TileIndex) => void;
    getVisibleTiles: () => TileGrid;
    bubbleParticleFactory: BubbleParticleFactory;
    particleEffectLayer: Container;
}

function delay(arg0: number, bubbleSprite: any) {
    throw new Error("Function not implemented.");
}

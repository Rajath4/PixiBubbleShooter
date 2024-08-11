import { Container } from "pixi.js";
import { TileIndex, TileContent, TileGrid } from "../../../../types/BubbleGridInterfaces";
import { ObserverHandler } from "../../ObserverHandler";

export default abstract class WeaponBubbleUIImpactControllerBase {
    init(dependency: IWeaponBubbleUIImpactControllerDependency) {
        this.dependency = dependency;
        this.addBubbleToGrid = dependency.addBubbleToGrid;
        this.removeBubbleFromTileIndex = dependency.removeBubbleFromTileIndex;
        this.getTiles = dependency.getTiles;
        this.layoutNode = dependency.layoutNode;
    }

    /**
    * It will act on the rock bubble based on its life
    * @param {*} rockGridPosition Grid position
    */
    protected actOnRockBubble(rockGridPosition: TileIndex) {
        return;
        //TODO: HANDLE ME
        // const tile = this.getTiles().get(rockGridPosition.row)[rockGridPosition.column];

        // const tileData = tile.data as RockBubbleData;
        // tileData.life--;

        // const rockBubble: RockBubble = tile.sprite as RockBubble;
        // rockBubble.onDataUpdate(tileData);

        // if (tileData.life === 0) {
        //     this.removeBubbleFromTileIndex(rockGridPosition);
        // }
    }

    /**
   * It will blast the rock bubble.
   * @param {*} row Row index of the rock bubble.
   * @param {*} column Column index of the rock bubble.
   */
    private blastRockBubble(row:number, column:number) {
        // const rockExplodeEffect = new cc.ParticleSystem.create(assets.ParticlePlist_BallExplode);
        // rockExplodeEffect.setPosition(this.tiles[row][column].position);
        // this.addChild(rockExplodeEffect, 100);
        // this.removeBubbleFromTileIndex(row, column);

    }

    protected addBubbleToGrid: (tileIndex: TileIndex, bubbleContent: TileContent) => void;
    protected removeBubbleFromTileIndex: (tileIndex: TileIndex) => void;
    protected getTiles: () => TileGrid;
    protected layoutNode: Container;

    protected dependency: IWeaponBubbleUIImpactControllerDependency;
}

export interface IWeaponBubbleUIImpactControllerDependency {
    addBubbleToGrid: (tileIndex: TileIndex, bubbleContent: TileContent) => void,
    removeBubbleFromTileIndex: (tileIndex: TileIndex) => void,
    getTiles: () => TileGrid
    layoutNode: Container,
    runtimeTempScoreUpdateObserver: ObserverHandler;
}
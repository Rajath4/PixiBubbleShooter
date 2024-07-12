import { WeaponBubbleActedTiles, TileGridContents } from "./bubbleLayout/model/TileGrid";
import TileGridModel from "./bubbleLayout/model/TileGridModel";
import FallingBubblesFinder from "./utils/FallingBubblesFinder";

export default class PostWeaponBubbleImpactSanityModel {
    constructor() {
        this.fallingBubblesFinder = new FallingBubblesFinder();
    }

    init(getLastVisibleRowIndex: () => number) {
        this.getLastVisibleRowIndex = getLastVisibleRowIndex;
    }

    getPostImpactInfo(tileGridModel: TileGridModel, impactedTiles: WeaponBubbleActedTiles): IPostWeaponBubbleImpactInfo {
        const fallingBubbles = this.getFallingBubbles(tileGridModel);

        return {
            fallingBubbles: fallingBubbles
        };
    }

    getFallingBubbles(tileGridModel: TileGridModel) {
        const fallingBubbles = this.fallingBubblesFinder.getFallingBubbles(tileGridModel.tiles, this.getLastVisibleRowIndex());
        return fallingBubbles;
    }

    private fallingBubblesFinder: FallingBubblesFinder;
    private getLastVisibleRowIndex: () => number;
}

export interface IPostWeaponBubbleImpactInfo {
    fallingBubbles: TileGridContents;
}
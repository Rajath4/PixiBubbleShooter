
import { TileIndex, ColorBubbleActedTiles } from "../bubbleLayout/model/TileGrid";
import TileGridModel from "../bubbleLayout/model/TileGridModel";
import ClusterFinder from "../utils/ClusterFinder";
import WeaponBubbleImpactComputationModelBase from "./WeaponBubbleImpactComputationModelBase";

export default class ColorWBImpactComputationModel extends WeaponBubbleImpactComputationModelBase {
    constructor() {
        super();
        this.clusterFinder = new ClusterFinder();
    }


    getColorBubbleActedTiles(impactedTileIndex: TileIndex, tileGridModel: TileGridModel): ColorBubbleActedTiles {
        const impactedTiles = this.clusterFinder.getCompleteCluster(impactedTileIndex, tileGridModel.tiles, this.getFirstVisibleRowIndex(), this.getLastVisibleRowIndex(), tileGridModel.isStartWithShifted);
        if (impactedTiles.colorBubbles.length < 3) {
            impactedTiles.colorBubbles = [];
            impactedTiles.specialBubbles = [];
        }
        return impactedTiles;
    }


    private clusterFinder: ClusterFinder;
}
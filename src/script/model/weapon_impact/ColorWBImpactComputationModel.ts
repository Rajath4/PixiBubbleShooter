

import TileGridModel from "../../components/bubbleLayout/model/TileGridModel";
import { TileIndex, ColorBubbleActedTiles } from "../../types/BubbleGridInterfaces";
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
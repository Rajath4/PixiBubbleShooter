
import { BubbleType } from "../../components/bubbleLayout/model/LayoutInterface";
import TileGridModel from "../../components/bubbleLayout/model/TileGridModel";
import { TileIndex, WeaponBubbleActedTiles } from "../../types/BubbleGridInterfaces";
import ColorWBImpactComputationModel from "./ColorWBImpactComputationModel";
import { IWeaponBubbleComputationModelDependency } from "./WeaponBubbleImpactComputationModelBase";

export default class WeaponBubbleImpactComputationModel {
    constructor() {
        this.colorBubbleComputationModel = new ColorWBImpactComputationModel();
    }

    init(dependency: IWeaponBubbleComputationModelDependency) {
        this.colorBubbleComputationModel.init(dependency);
    }

    getWeaponBubbleActedTiles(weaponBubbleType: BubbleType, tileGridModel: TileGridModel, weaponBubbleImpactedTileIndex: TileIndex): WeaponBubbleActedTiles {
        if (weaponBubbleType === BubbleType.ColorBubble) {
            return this.colorBubbleComputationModel.getColorBubbleActedTiles(weaponBubbleImpactedTileIndex, tileGridModel);
        }
    }

    performWeaponBubbleImpact(weaponBubbleType: BubbleType, tileGridModel: TileGridModel, weaponBubbleActedTiles: WeaponBubbleActedTiles) {
        if (weaponBubbleType === BubbleType.ColorBubble) {
            weaponBubbleActedTiles.colorBubbles.forEach((tileIndex) => {
                const tile = tileGridModel.getTile(tileIndex);
                tile.content.data.model.execute(tileGridModel, tile);
            });
            weaponBubbleActedTiles.specialBubbles.forEach((tileIndex) => {
                //TODO: HANDLE ME
                // const tile = tileGridModel.getTile(tileIndex);
                // const data = tile.data as RockBubbleData;
                // data.life--;
                // if (data.life == 0) {
                //     tileGridModel.emptyTile(tileIndex);
                // }
            });
        } 
    }

    private colorBubbleComputationModel: ColorWBImpactComputationModel;
}
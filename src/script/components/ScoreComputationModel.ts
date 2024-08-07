import { IWeaponBubbleImpactInfo, ScoreInfo } from "./bubbleLayout/GamePlayEngineModelInterfaces";
import { WeaponBubbleActedTiles, TileGridContents } from "./bubbleLayout/model/TileGrid";

export default class ScoreComputationModel {

    getScore(weaponBubbleImpactInfo: IWeaponBubbleImpactInfo): ScoreInfo {
        const forPlacing = 1;
        const impact = this.getWeaponBubbleImpactScore(weaponBubbleImpactInfo.weaponBubbleActedTiles);
        const falling = this.getFallingBubbleScore(weaponBubbleImpactInfo.fallingBubbles);
        const total = forPlacing + impact + falling;

        return {
            forPlacing: forPlacing,
            impact: impact,
            falling: falling,
            total: total
        }
    }

    private getWeaponBubbleImpactScore(weaponBubbleActedTiles: WeaponBubbleActedTiles) {
        return weaponBubbleActedTiles.colorBubbles.length;
    }

    private getFallingBubbleScore(fallingBubbles: TileGridContents) {
        return fallingBubbles.bubbles.length;
    }
}
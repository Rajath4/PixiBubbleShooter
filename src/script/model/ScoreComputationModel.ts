import { IWeaponBubbleImpactInfo, ScoreInfo } from "../components/bubbleLayout/GamePlayEngineModelInterfaces";
import { TileGridContents, WeaponBubbleActedTiles } from "../types/BubbleGridInterfaces";

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
        return weaponBubbleActedTiles.colorBubbles.length * 5;
    }

    private getFallingBubbleScore(fallingBubbles: TileGridContents) {
        return fallingBubbles.bubbles.length * 5;
    }
}
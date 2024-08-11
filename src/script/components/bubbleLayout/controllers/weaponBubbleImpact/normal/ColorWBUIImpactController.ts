import { IWeaponBubbleImpactInfo } from "../../../GamePlayEngineModelInterfaces";
import { IRuntimeScoreUpdateInfo } from "../../../GamePlayGenericTypes";
import { BubbleSprite } from "../../../model/BubbleSprite";
import { BubbleType } from "../../../model/LayoutInterface";
import { ColorBubbleActedTiles, TileIndex } from "../../../../../types/BubbleGridInterfaces";
import WeaponBubbleUIImpactControllerBase from "../WeaponBubbleUIImpactControllerBase";

export default class ColorWBUIImpactController extends WeaponBubbleUIImpactControllerBase {
    async performWeaponBubbleTask(weaponBubbleImpactInfo: IWeaponBubbleImpactInfo) {
        this.addBubbleToGrid(weaponBubbleImpactInfo.weaponBubbleTileIndex, weaponBubbleImpactInfo.weaponBubbleContent);

        if (weaponBubbleImpactInfo.weaponBubbleActedTiles.colorBubbles.length < 3) {
            return;
        }

        const weaponBubbleActedTiles = weaponBubbleImpactInfo.weaponBubbleActedTiles as ColorBubbleActedTiles;
        await this.removeCluster(weaponBubbleActedTiles.colorBubbles);
    }

    /**
    * It will remove the bubble from specified cluster location
     * @param {Array} cluster Contains a list of row and columns where Bubble should be removed
    */

    async removeCluster(bubbleCluster: TileIndex[]) {
        const actions: Promise<unknown>[] = [];

        // GamePlaySFXController.instance.onBubbleGroupBurst();

        bubbleCluster.forEach((bubble, index) => {
            actions.push(this.actOnBubble(bubble, index));
        });

        return Promise.all(actions);
    }

    private actOnBubble(bubble: TileIndex, index: number) {
        return new Promise(async (resolve) => {
            const tile = this.getTiles().get(bubble.row)[bubble.column];
            this.dependency.runtimeTempScoreUpdateObserver.notifyObservers({
                scoreGained: 1, //TODO: HANDLE ME 
                scoreGainPosition: tile.content.data.ui.node.position,
                scoreStripeColor: null,
                bubbleRadius: 60, //TODO: HANDLE ME
            } as IRuntimeScoreUpdateInfo);
            await (tile.content.data.ui as BubbleSprite).blast();
            this.removeBubbleFromTileIndex(bubble);
            resolve(true);
        });
    }
}
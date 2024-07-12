import { IWeaponBubbleImpactInfo } from "../../../GamePlayEngineModelInterfaces";
import { IRuntimeScoreUpdateInfo } from "../../../GamePlayGenericTypes";
import { BubbleSprite } from "../../../model/BubbleSprite";
import { BubbleType } from "../../../model/LayoutInterface";
import { ColorBubbleActedTiles, TileIndex } from "../../../model/TileGrid";
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
        const actions:Promise<unknown>[] = [];

        console.error("removeCluster");

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

            await this.performBubbleBurstAnim(bubble);
            this.removeBubbleFromTileIndex(bubble);
            resolve(true);
        });
    }

    performBubbleBurstAnim(tileIndex: TileIndex) {
        return new Promise(async (resolve) => {
            const tile = this.getTiles().get(tileIndex.row)[tileIndex.column];

            if (tile.content.type === BubbleType.ColorBubble) {
                await tile.content.data.ui.execute({});

                // const burstEffect = this.bubbleParticleFactory.getBubbleBurstEffect();
                // this.particleEffectLayer.addChild(burstEffect);
                // burstEffect.setWorldPosition(tile.content.data.ui.node.worldPosition);
                // burstEffect.getComponent(BubbleBurstEffect).init((tile.content.data.ui as ColorBubble).getColor());
                // await delay(1, this.bubbleParticleFactory);
                // burstEffect.destroy();
            } else {
                //TODO: HANDLE ME
                // this.actOnRockBubble(bubble)
            }

            resolve(true);
        });
    }
}
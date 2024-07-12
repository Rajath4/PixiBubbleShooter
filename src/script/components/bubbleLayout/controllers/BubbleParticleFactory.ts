import { Color, Container } from "pixi.js";
import { ColorBubbleData } from "../model/Bubble";
import { BubbleType } from "../model/LayoutInterface";
import { Tile } from "../model/TileGrid";

export class BubbleParticleFactory extends Container {


    init(getBubbleColor: (bubbleColor: string) => Color) {
        // this.getBubbleColor = getBubbleColor;
    }

    getBubbleParticleEffect(type: BubbleType): any {
        // const node = instantiate(this.getBubblePrefab(type));
        // return node.getComponent(ParticleSystem2D);
        return null;
    }

    initBubbleParticleEffectOnTile(type: BubbleType, tile: Tile, parent: Node) {
        return new Promise((resolve, reject) => {
            // if (tile.content.type === BubbleType.ColorBubble) {
            //     const data = tile.content.data.model.data as ColorBubbleData;
            //     const bubbleExplodeEffect = this.getBubbleParticleEffect(type);
            //     bubbleExplodeEffect.startColor = this.getBubbleColor(data.color);
            //     bubbleExplodeEffect.endColor = this.getBubbleColor(data.color);
            //     parent.addChild(bubbleExplodeEffect.node);
            //     bubbleExplodeEffect.node.setPosition(tile.position);


            //     const effectDuration = bubbleExplodeEffect.duration;

            //     bubbleExplodeEffect.onDestroy = () => {
            //         bubbleExplodeEffect.node.destroy();
            //     }

            //     this.scheduleOnce(() => {
            //         resolve(true);
            //     }, effectDuration);
            // } else {
            //     resolve(true);
            // }
            resolve(true);
        });
    }

    initBombDustParticleEffectOnTile(type: BubbleType, tile: Tile, parent: Node) {
        return new Promise((resolve, reject) => {
            // const data = tile.data as ColorBubbleData;

            // const bombDustEffect = this.getBubbleParticleEffect(BubbleType.Bomb);
            // bombDustEffect.startColor = color(255, 0, 0, 255);
            // bombDustEffect.endColor = color(90, 90, 90, 255);
            // bombDustEffect.node.setPosition(tile.position);
            // parent.addChild(bombDustEffect.node);

            // const effectDuration = bombDustEffect.duration;

            // bombDustEffect.onDestroy = () => {
            //     bombDustEffect.node.destroy();
            // }

            // this.scheduleOnce(() => {
            //     resolve(true);
            // }, effectDuration);
        });
    }

    getBubbleBurstEffect(): Node {
        return null;
        // return instantiate(this.colorBubbleBurstPrefab);
    }

    private getBubblePrefab(type: BubbleType): any {
        // switch (type) {
        //     case BubbleType.ColorBubble:
        //         return this.comboBlastParticlePrefab;
        //     // case BubbleType.ColorBlast:
        //     //     return this.colorBlastParticlePrefab;
        //     // case BubbleType.Bomb:
        //     //     return this.bombParticlePrefab;
        //     default:
        //         throw ("Something went wrong!!!");
        // }
    }

    // private getBubbleColor = (bubbleColor: string) => Color.WHITE;
}
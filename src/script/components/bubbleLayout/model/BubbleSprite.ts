import { Color, Container, Point, Sprite } from "pixi.js";
import { IBubbleSprite, IBubbleExecutionData } from "./TileGrid";


export class BubbleSprite implements IBubbleSprite {
    node: Container;
    sprite: Sprite;

    constructor() {
        this.node = new Container();
        this.sprite = Sprite.from('bubble');
        this.node.addChild(this.sprite);
        this.sprite.setSize(100, 100);
    }

    setScale(scale: number) {
        this.sprite.scale = scale;
    }

    setWorldPosition(position: Point) {
        this.sprite.position = position;
    }

    getWorldPosition() {
        return this.sprite.position;
    }

    setColor(color: Color) {
        this.sprite.tint = color;
    }

    setMaterial(material: any) {
        // this.bubbleSprite.material = material;
        // if (this.bubbleSpriteShine) {
        //     this.bubbleSpriteShine.material = material;
        // }
    }

    execute(data: IBubbleExecutionData): Promise<boolean> {
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    }
}


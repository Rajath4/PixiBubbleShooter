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
        this.node.scale = 1;
    }

    setWorldPosition(position: Point) {
        this.node.position = position;
        this.sprite.position = new Point(0, 0);
    }

    getWorldPosition() {
        return this.node.toGlobal(new Point(0, 0));
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


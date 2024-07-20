import { Color, Container, Point, Sprite } from "pixi.js";
import { IBubbleSprite, IBubbleExecutionData } from "./TileGrid";


export class BubbleSprite extends Container implements IBubbleSprite {
    sprite: Sprite;
    private spriteShine: Sprite;

    constructor() {
        super();
        this.sprite = Sprite.from('bubble');
        this.addChild(this.sprite);
        this.sprite.setSize(100, 100);

        this.spriteShine = Sprite.from('bubble_shine');
        this.addChild(this.spriteShine);
    }

    setScale(scale: number) {
        this.sprite.scale = scale;
        this.spriteShine.scale = scale;
        this.scale = 1;
    }

    setWorldPosition(position: Point) {
        this.position = position;
        this.sprite.position = new Point(0, 0);
        this.spriteShine.position = new Point(0, 0);
    }

    getWorldPosition() {
        return this.toGlobal(new Point(0, 0));
    }

    setColor(color: Color) {
        this.sprite.tint = color;
    }

    get node(): Container {
        return this;
    }

    execute(data: IBubbleExecutionData): Promise<boolean> {
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    }
}


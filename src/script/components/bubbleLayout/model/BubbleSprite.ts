import { Color, Container, Point, Sprite } from "pixi.js";
import { IBubbleSprite, IBubbleExecutionData } from "./TileGrid";
import { gsap } from "gsap";


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

    setOpacity(opacity: number) {
        this.sprite.alpha = opacity;
        this.spriteShine.alpha = opacity;
    }

    get node(): Container {
        return this;
    }

    reset() {
        gsap.killTweensOf(this);
        //Stop all animations
        // this.sprite.alpha = 1;
        // this.spriteShine.alpha = 1;
        // this.sprite.scale = 1;
        // this.spriteShine.scale = 1;
        // this.sprite.position = new Point(0, 0);
        // this.spriteShine.position = new Point(0, 0);
        // this.position = new Point(0, 0);
    }

    execute(data: IBubbleExecutionData): Promise<boolean> {
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    }
}


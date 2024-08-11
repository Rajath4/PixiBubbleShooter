import { gsap } from "gsap";
import { Color, Container, Point, Sprite } from "pixi.js";
import { IBubbleExecutionData, IBubbleSprite } from "../../../types/BubbleGridInterfaces";


export class BubbleSprite extends Container implements IBubbleSprite {
    private sprite: Sprite;
    private spriteShine: Sprite;

    constructor() {
        super();
        this.sprite = Sprite.from('bubble');
        this.addChild(this.sprite);
        this.sprite.setSize(102, 102);

        this.spriteShine = Sprite.from('bubble_shine');
        this.addChild(this.spriteShine);    
    }

    setAnchor(anchor: Point) {
        this.sprite.anchor = anchor;
        this.spriteShine.anchor = anchor;
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

    blast() {
        return new Promise((resolve, reject) => {
            // Get current scale for both sprites
            const currentScaleX = this.sprite.scale.x;
            const currentScaleY = this.sprite.scale.y;
    
            // Initial quick scale up based on current scale
            gsap.to([this.sprite.scale, this.spriteShine.scale], { 
                x: currentScaleX * 1.2, 
                y: currentScaleY * 1.2, 
                duration: 0.1 
            });
    
            // Final scale down to zero and fade out
            const scaleTween = gsap.to([this.sprite.scale, this.spriteShine.scale], { 
                x: 0, 
                y: 0, 
                duration: 0.4, 
                delay: 0.1 
            });
    
            const fadeTween = gsap.to([this.sprite, this.spriteShine], { 
                alpha: 0, 
                duration: 0.4, 
                delay: 0.1,
                onComplete: () => {
                    resolve(true);  // Resolve the promise when the fade out completes
                }
            });
        });
    }
    

    reset() {
        // Reset all properties to initial state
        gsap.killTweensOf([this.sprite, this.spriteShine, this.sprite.scale, this.spriteShine.scale]);
        this.sprite.alpha = 1;
        this.spriteShine.alpha = 1;
        this.sprite.scale.set(1, 1);
        this.spriteShine.scale.set(1, 1);
    }

    execute(data: IBubbleExecutionData): Promise<boolean> {
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    }
}


import { gsap } from 'gsap';
import { Point, Sprite, Texture } from 'pixi.js';

type ButtonCallback = () => void;

export class Button extends Sprite {
    private onClickCallback: ButtonCallback;

    constructor(texture: Texture, width = 200, height = 75) {
        super(texture);
        this.width = width;
        this.height = height;
        this.anchor.set(0.5);
        this.interactive = true;

        this.on('pointerdown', this.onButtonDown.bind(this))
            .on('pointerup', this.onButtonUp.bind(this))
            .on('pointerupoutside', this.onButtonUp.bind(this))
            .on('pointerover', this.onButtonOver.bind(this))
            .on('pointerout', this.onButtonOut.bind(this));
    }

    onClick(callback: ButtonCallback) {
        this.onClickCallback = callback;
    }

    setPosition(x: number, y: number) {
        this.position.set(x, y);
    }
   
    protected onButtonUp() {
        gsap.to(this.scale, { duration: 0.1, x: '+=0.05', y: '+=0.05', ease: 'power2.out'});
    }

    private onButtonOver() {
        gsap.to(this, { duration: 0.2, alpha: 0.7, ease: 'power1.inOut' });
    }

    private onButtonDown() {
        gsap.to(this.scale, { duration: 0.1, x: '-=0.05', y: '-=0.05', ease: 'power2.out' });
        if (this.onClickCallback) {
            this.onClickCallback();
        } else {
            console.error('onClick callback is not set');
        }
    }


    private onButtonOut() {
        gsap.to(this, { duration: 0.2, alpha: 1, ease: 'power1.inOut' });
    }
}

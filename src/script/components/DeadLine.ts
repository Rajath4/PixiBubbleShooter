import { Point, Size, Sprite, Texture } from 'pixi.js';

class DeadLine extends Sprite {
    private layerSize:Size;
    private deadLinePositionY: number;

    constructor(layerSize:Size) {
        super();
        this.layerSize = layerSize;
        this.texture = Texture.from('dead_line');
        this.initDeadLine();
    }

    private initDeadLine() {
        this.deadLinePositionY =  this.layerSize.height * 0.75;
        this.position = new Point(0, this.deadLinePositionY);
        this.width =  this.layerSize.width;
        this.tint = 0xff0000;
        this.alpha = 0.3;
    }

    isCrossed(fistVisibleRowPosY:number) {
        if (!fistVisibleRowPosY) {
            return true;
        } else {
            if (fistVisibleRowPosY >= this.deadLinePositionY) {
                return true;
            } else {
                return false;
            }
        }
    }
}

export default DeadLine;

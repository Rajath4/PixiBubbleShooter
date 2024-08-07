import { Sprite, Application, Point, Texture } from 'pixi.js';

class DeadLine extends Sprite {
    private app: Application;
    private deadLinePositionY: number;

    constructor(app: Application) {
        super();
        this.app = app;
        this.texture = Texture.from('dead_line');
        this.initDeadLine();
    }

    private initDeadLine() {
        this.deadLinePositionY = this.app.screen.height * 0.75;
        this.position = new Point(0, this.deadLinePositionY);
        this.width = this.app.screen.width;
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

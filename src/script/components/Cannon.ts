import { Application, Container, Sprite, Point } from 'pixi.js';
import { getAngleBetweenTwoPoints, radToDeg } from './utils';
import { getScaleFactor } from '../utils';

export class CannonContainer {
    private app: Application;
     container: Container;
    private cannon: Sprite;

    constructor(app: Application, parent: Container) {
        this.app = app;
        this.container = new Container();
        parent.addChild(this.container);

        this.init();
    }

    private init() {
        this.initCannon();
    }

    private initCannon() {
        this.cannon = Sprite.from('cannon');
        this.cannon.anchor.set(0.5);
        this.cannon.scale.set(1 * getScaleFactor());
        this.cannon.position = new Point(this.app.screen.width / 2, this.app.screen.height - this.cannon.height / 2);
        this.container.addChild(this.cannon);
    }

    onTouchStart(touchPoint: Point) {
        // this.stopCannonRotationAnim();

        // if (this.isCanonHavingValidRotation(touchPoint)) {
        //     this.trajectory.show(touchPoint, this.weaponBubble.getPosition(), (this.weaponBubble.content.model as ColorBubbleModel).data);
            this.rotateCannon(this.getCannonRotationAngle(touchPoint));

        // } else {
        //     this.trajectory.remove();
        // }
    }


    private rotateCannon(angle: number) {
        console.log('rotateCannon', angle);
        this.cannon.angle = angle;
    }

    private getCannonRotationAngle(touchPoint: Point) {
        let cannonCenter = this.cannon.toGlobal(new Point(0, 0));  // Assuming anchor is at 0.5, 0.5
        console.log('cannonCenter', cannonCenter,touchPoint);
        let angle = getAngleBetweenTwoPoints( cannonCenter,touchPoint);
        angle = radToDeg(angle);
        angle = -90 + angle;
        return angle;
    }
}
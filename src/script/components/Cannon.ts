import { Application, Container, Sprite, Point, Size } from 'pixi.js';
import { getAngleBetweenTwoPoints, radToDeg } from './utils';
import { getScaleFactor } from '../utils';
import WeaponBubbleModel from './WeaponBubbleModel';
import { TileGrid, TileData } from './bubbleLayout/model/TileGrid';
import BubbleShooterGamePlayModel from './BubbleShooterGamePlayModel';
import { TrajectoryLayer } from './TrajectoryLayer';
import { BubbleSprite } from './bubbleLayout/model/BubbleSprite';
import { ColorBubbleModel } from './bubbleLayout/model/ColorBubbleModel';
import { TrajectoryBubbleSprite } from './bubbleLayout/model/TrajectoryBubbleSprite';

export class CannonContainer extends Container {
    private app: Application;
    private cannon: Sprite;

    private cannon_bg: Node = null;

    private cannonBubbleHolder: Node = null;

    private cannonBubbleHolder1: Node = null;

    private cannonBubbleHolder2: Node = null;

    trajectory: TrajectoryLayer;


    init(app: Application, dependency: ICannonUIIDependencies) {
        this.app = app;

        this.dependency = dependency;

        this.weaponBubbleModel = dependency.gameModel.weaponBubbleModel;

        this.trajectory = new TrajectoryLayer();

        this.trajectory.init(
            dependency.isFullTrajectory,
            dependency.radiusOfBubble,
            { x: dependency.layerSize.width, y: dependency.layerSize.height, width: dependency.layerSize.width, height: dependency.layerSize.height },
            dependency.tilesInGrid,
            dependency.convertGameLayerToBubbleLayer,
            dependency.showVisualRepOfWeaponBubble,
            dependency.disableVisualRepOfWeaponBubble,
            dependency.gameModel
        );
    }

    initCannon() {
        this.cannon = Sprite.from('cannon');
        this.cannon.anchor.set(0.5, 0.5);
        this.cannon.scale.set(1 * getScaleFactor());
        this.cannon.position = new Point(this.app.screen.width * 0.5, this.app.screen.height - this.cannon.height * 0.5);
        // this.addChild(this.cannon);

        this.renderCanonWeapon();
    }


    private renderCanonWeapon() {
        const bubble = this.weaponBubble.sprite as BubbleSprite;
        bubble.position = new Point(this.app.screen.width * 0.5, this.app.screen.height - this.cannon.height * 0.5);
        bubble.setScale(1 * getScaleFactor());
        // bubble.setAnchor(new Point(0.5, 0.5));
        this.addChild(bubble);
    }

    onTouchStart(touchPoint: Point) {
        this.stopCannonRotationAnim();

        if (this.isCanonHavingValidRotation(touchPoint)) {
            this.trajectory.show(touchPoint, this.weaponBubble.getPosition(), (this.weaponBubble.content.model as ColorBubbleModel).data);
            this.rotateCannon(this.getCannonRotationAngle(touchPoint));

        } else {
            this.trajectory.remove();
        }
    }

    onTouchMove(touchPoint: Point) {
        this.stopCannonRotationAnim();


        if (this.isCanonHavingValidRotation(touchPoint)) {

            this.trajectory.show(touchPoint, this.weaponBubble.getPosition(),
                (this.weaponBubble.content.model as ColorBubbleModel).data);
            this.rotateCannon(this.getCannonRotationAngle(touchPoint));

        } else {
            this.trajectory.remove();

        }
    }

    onTouchEnd(touchPoint: Point): boolean {
        this.stopCannonRotationAnim();

        const isCanonHavingValidRotation = this.isCanonHavingValidRotation(touchPoint);
        if (isCanonHavingValidRotation) {
            this.trajectory.remove();
            this.rotateCannon(this.getCannonRotationAngle(touchPoint));
        } else {
            this.trajectory.remove();
        }

        return isCanonHavingValidRotation;
    }

    onWeaponBubblePopFromCannon(stageLayerNode: Container) {
        const weaponBubblePos = this.weaponBubble.getPosition();

        const bubble = this.weaponBubble.sprite as BubbleSprite;
        bubble.removeFromParent();
        bubble.setScale(this.dependency.bubbleScaleFactor);
        this.dependency.layoutNode.addChild(bubble);
        bubble.setWorldPosition(weaponBubblePos);

        console.error("AAA pos", weaponBubblePos)
        // this.scheduleOnce(() => {
        //     this.cannonToOriginalPosition();
        // }, 0.25); //TODO: remove this hard coded value
    }


    /**
   * Check for valid canon rotation
   * @param {*} touchPoint User touch input
   * @returns
   */
    private isCanonHavingValidRotation(touchPoint: Point) {
        const angle = radToDeg(
            getAngleBetweenTwoPoints(
                touchPoint,
                this.getWorldPosition())
        );
        console.error("Angle", angle);

        return true;
        if (angle >= -180 && angle <= 0) {
            if (touchPoint.y > this.getWorldPosition().y) {
                return true;
            }
        }
        return false;
    }

    private rotateCannon(angle: number) {
        console.log('rotateCannon', angle);
        this.cannon.angle = angle;
    }

    getActiveWeaponBubble() {
        return this.weaponBubble;
    }

    private getWorldPosition() {
        return this.cannon.toGlobal(this.weaponBubble.sprite.getWorldPosition());
    }

    private stopCannonRotationAnim() {

    }

    onWeaponBubbleActionComplete() {
        this.weaponBubbleModel.onWeaponBubbleActionComplete();
        this.renderCanonWeapon();
    }

    get weaponBubble() {
        return this.weaponBubbleModel.getWeaponBubble();
    }

    private getCannonRotationAngle(touchPoint: Point) {
        let cannonCenter = this.getWorldPosition();  // Assuming anchor is at 0.5, 0.5
        console.log('cannonCenter', cannonCenter, touchPoint);
        let angle = getAngleBetweenTwoPoints(cannonCenter, touchPoint);
        angle = radToDeg(angle);
        angle = -90 + angle;
        return angle;
    }

    private weaponBubbleModel: WeaponBubbleModel;
    private dependency: ICannonUIIDependencies = null;

    private _deactivateBubbleSwap = false;
}

export interface ICannonUIIDependencies {
    isFullTrajectory: boolean,
    radiusOfBubble: number,
    layerSize: Size,
    tilesInGrid: TileGrid,
    convertGameLayerToBubbleLayer: (pos: Point) => Point,
    showVisualRepOfWeaponBubble: (pos: Point, data: TileData) => void,
    disableVisualRepOfWeaponBubble: () => void,
    layoutNode: Container,
    gameModel: BubbleShooterGamePlayModel,
    bubbleScaleFactor: number,
}
import { Container, Point, Size, Sprite } from 'pixi.js';
import { ICannonUIIDependencies } from '../types/GamePlayEngineDependency';
import { TrajectoryLayer } from './TrajectoryLayer';
import WeaponBubbleComputationModel from './WeaponBubbleComputationModel';
import { BubbleSprite } from './bubbleLayout/model/BubbleSprite';
import { ColorBubbleModel } from './bubbleLayout/model/ColorBubbleModel';
import { getScaleFactor, radToDeg, getAngleBetweenTwoPoints } from '../utils/utils';

export class CannonContainer extends Container {
    private layerSize: Size;
    private bottomBase: Sprite = null;
    trajectory: TrajectoryLayer;


    init(layerSize: Size, dependency: ICannonUIIDependencies) {
        this.layerSize = layerSize;
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
        this.bottomBase = Sprite.from('bottom_base');
        this.bottomBase.anchor.set(0.5, 0.5);
        this.bottomBase.scale.set(1 * getScaleFactor());
        this.bottomBase.position = new Point(this.layerSize.width * 0.5, this.layerSize.height - this.bottomBase.height * 0.5);
        this.addChild(this.bottomBase);

        this.renderCanonWeapon();
    }


    private renderCanonWeapon() {
        const bubble = this.weaponBubble.sprite as BubbleSprite;
        bubble.position = new Point(this.layerSize.width * 0.5, this.layerSize.height - this.bottomBase.height);
        bubble.setScale(1 * getScaleFactor());
        bubble.setAnchor(new Point(0.5, 0.5));
        this.addChild(bubble);
    }

    onTouchStart(touchPoint: Point) {
        if (this.isCanonHavingValidRotation(touchPoint)) {
            this.trajectory.show(touchPoint, this.weaponBubble.getPosition(), (this.weaponBubble.content.model as ColorBubbleModel).data);
        } else {
            this.trajectory.remove();
        }
    }

    onTouchMove(touchPoint: Point) {
        if (this.isCanonHavingValidRotation(touchPoint)) {
            this.trajectory.show(touchPoint, this.weaponBubble.getPosition(), (this.weaponBubble.content.model as ColorBubbleModel).data);
        } else {
            this.trajectory.remove();
        }
    }

    onTouchEnd(touchPoint: Point): boolean {
        const isCanonHavingValidRotation = this.isCanonHavingValidRotation(touchPoint);
        this.trajectory.remove();

        return isCanonHavingValidRotation;
    }

    onWeaponBubblePopFromCannon() {
        const weaponBubblePos = this.weaponBubble.getPosition();

        const bubble = this.weaponBubble.sprite as BubbleSprite;
        bubble.removeFromParent();
        bubble.setScale(this.dependency.bubbleScaleFactor);
        this.dependency.layoutNode.addChild(bubble);
        bubble.setWorldPosition(weaponBubblePos);
        bubble.setAnchor(new Point(0.5, 0.5));
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

        if (angle >= -160 && angle <= -30) {
            return true;
        }
        return false;
    }

    getActiveWeaponBubble() {
        return this.weaponBubble;
    }

    private getWorldPosition() {
        return this.toGlobal(this.weaponBubble.sprite.getWorldPosition());
    }

    onWeaponBubbleActionComplete() {
        this.weaponBubbleModel.onWeaponBubbleActionComplete();
        this.renderCanonWeapon();
    }

    get weaponBubble() {
        return this.weaponBubbleModel.getWeaponBubble();
    }

    private weaponBubbleModel: WeaponBubbleComputationModel;
    private dependency: ICannonUIIDependencies = null;
}


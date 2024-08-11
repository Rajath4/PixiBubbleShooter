import { Container, FederatedPointerEvent, Point, Size } from "pixi.js";
import StageGamePlayLayerDependencyProvider from "../StageGamePlayLayerDependencyProvider";
import Background from "../components/Background";
import BubbleShooterGamePlayModel from "../components/BubbleShooterGamePlayModel";
import { CannonContainer } from "../components/Cannon";
import DeadLine from "../components/DeadLine";
import { UIContainer } from "../components/UIContainer";
import { DynamicBubbleLayout } from "../components/bubbleLayout/DynamicBubbleLayout";
import { IWeaponBubbleImpactInfo } from "../components/bubbleLayout/GamePlayEngineModelInterfaces";
import { ObserverHandler } from "../components/bubbleLayout/ObserverHandler";
import { getDummyLayout } from "../components/bubbleLayout/StaticBubbleLayout";
import { BubbleFactoryController } from "../components/bubbleLayout/model/BubbleFactoryController";
import { BubbleType } from "../components/bubbleLayout/model/LayoutInterface";
import { getDiagonalLengthOfRectangle } from "../components/utils";
import { designResolution } from "../config";

export type GameResultCallBack = (isWon: boolean, sessionScore: number) => void;

export class GamePlayView extends Container {
    private cannon: CannonContainer;
    private bubbleLayoutLayer: DynamicBubbleLayout;
    private uiLayer: UIContainer;
    private deadLine: DeadLine;
    private layerSize: Size;


    init(layerSize: Size) {
        this.layerSize = layerSize;

        this.children.forEach(child => {
            child.destroy({ children: true, texture: true });
        });

        this.removeAllListeners();
        this.removeChildren();

        this.velocityOfWeaponBubble = 2000 * (getDiagonalLengthOfRectangle(layerSize.width, layerSize.height) / designResolution.diagonal); //1000 is the velocity in design resolution.

        this.initBG();

        this.model = new BubbleShooterGamePlayModel();

        this.dependencyProvider = new StageGamePlayLayerDependencyProvider();

        const bubbleFactoryController = new BubbleFactoryController();

        this.bubbleLayoutLayer = new DynamicBubbleLayout();
        this.cannon = new CannonContainer();

        this.dependencyProvider.init(this, this.bubbleLayoutLayer, this.cannon, this.model, layerSize,
            this.convertBubbleLayerToGameLayer.bind(this), this.convertGameLayerToBubbleLayer.bind(this), bubbleFactoryController);

        this.bubbleLayoutLayer.initLayout(getDummyLayout(), false, layerSize, this.model.tileGridModel, bubbleFactoryController, this._runtimeTempScoreUpdateObserver);
        this.cannon.init(layerSize, this.dependencyProvider.getCannonDependency());
        this.model.init(this.dependencyProvider.getGameModelDependency());

        this.cannon.initCannon();


        this.addChild(this.cannon);
        this.addChild(this.bubbleLayoutLayer);
        this.addChild(this.cannon.trajectory);
        this.cannon.trajectory.zIndex = 0;
        this.cannon.zIndex = 100;
        this.bubbleLayoutLayer.zIndex = 10;

        this.initTouchListeners();
        this.initDeadLine();
        this.initUILayer();
        this.interactive = true;
    }

    private initTouchListeners() {
        this.on('pointerdown', this.onTouchStartReceived);
        this.on('pointermove', this.onTouchMoveReceived);
        this.on('pointerup', this.onTouchEndReceived);
    }

    private removeTouchListeners() {
        this.off('pointerdown', this.onTouchStartReceived);
        this.off('pointermove', this.onTouchMoveReceived);
        this.off('pointerup', this.onTouchEndReceived);
    }

    private initDeadLine() {
        this.deadLine = new DeadLine(this.layerSize);
        this.addChild(this.deadLine);
    }

    private initUILayer() {
        this.uiLayer = new UIContainer(this.layerSize);
        this.addChild(this.uiLayer);
        this.uiLayer.zIndex = 300;
    }

    private initBG() {
        const background = new Background(this.layerSize);
        this.addChild(background);
    }

    private getTouchPoint(event: FederatedPointerEvent) {
        const globalTp = new Point(event.global.x, event.global.y);
        return this.toLocal(globalTp);
    }

    private onTouchStartReceived = (event: FederatedPointerEvent) => {
        const tp = this.getTouchPoint(event);
        this.cannon.onTouchStart(tp);
    }

    private onTouchMoveReceived = (event: FederatedPointerEvent) => {
        const tp = this.getTouchPoint(event);
        this.cannon.onTouchMove(tp);
    }

    private onTouchEndReceived = (event: FederatedPointerEvent) => {
        const tp = this.getTouchPoint(event);

        const isCanonHavingValidRotation = this.cannon.onTouchEnd(tp);
        if (!isCanonHavingValidRotation) {
            return;
        }
        this.interactive = false;
        this.startWeaponBubbleAction(tp);
    }

    private async startWeaponBubbleAction(tp: Point) {
        const weaponBubbleContent = this.cannon.weaponBubble.content;
        this.cannon.onWeaponBubblePopFromCannon(this);

        const weaponBubbleImpactInfo: IWeaponBubbleImpactInfo = this.model.onWeaponBubbleFired(tp, this.cannon.weaponBubble, this.bubbleLayoutLayer.getTileGridModel().getClone());
        weaponBubbleImpactInfo.weaponBubbleContent = { type: BubbleType.ColorBubble, data: weaponBubbleContent };

        // this.currentStageState = EachRoundGamePlayStageStates.weaponBubbleIsMoving;

        console.error('weaponBubbleImpactInfo ', weaponBubbleImpactInfo)
        await this.cannon.weaponBubble.moveWeaponBubble(this.velocityOfWeaponBubble, weaponBubbleImpactInfo);
        await this.onWeaponBubbleMovementComplete(weaponBubbleImpactInfo);
    }


    private convertBubbleLayerToGameLayer(position: Point) {
        const worldPosition = this.bubbleLayoutLayer.toGlobal(position);
        return this.toLocal(worldPosition);
    }

    private convertGameLayerToBubbleLayer(position: Point) {
        const worldPosition = this.toGlobal(position);
        return this.bubbleLayoutLayer.toLocal(worldPosition);
    }

    private async onWeaponBubbleMovementComplete(weaponBubbleImpactInfo: IWeaponBubbleImpactInfo) {
        // console.log("onWeaponBubbleMovementComplete" + new Date());
        await this.bubbleLayoutLayer.onWeaponBubbleMovementComplete(weaponBubbleImpactInfo);

        this.model.playerSessionDataModel.onScoreGain(weaponBubbleImpactInfo.score.total);
        this.uiLayer.setScore(this.model.playerSessionDataModel.getScore());

        if (this.isWon()) {
            console.log("Game Won");
            this.emit('gameOver', true, this.model.playerSessionDataModel.getScore())

        } else if (this.isGameOver()) {
            console.log("Game Over");
            this.emit('gameOver', false, this.model.playerSessionDataModel.getScore())
        } else {
            this.cannon.onWeaponBubbleActionComplete();
            this.interactive = true;
        }
    }

    private isGameOver() {
        return this.deadLine.isCrossed(this.bubbleLayoutLayer.getTileGridModel().getFirstFilledRowYPosition());
    }

    private isWon() {
        return this.bubbleLayoutLayer.getTileGridModel().isGridEmpty();
    }

    destroy(options?: any) {
        this.removeTouchListeners();
        // Clean up any event listeners or references
        super.destroy(options);
    }

    private velocityOfWeaponBubble = 1000;
    private model: BubbleShooterGamePlayModel = null;

    private _runtimeTempScoreUpdateObserver: ObserverHandler = new ObserverHandler();
    private dependencyProvider: StageGamePlayLayerDependencyProvider;
}
import { Application, Color, Container, Point, Sprite } from "pixi.js";
import StageGamePlayLayerDependencyProvider from "./StageGamePlayLayerDependencyProvider";
import { UIContainer } from "./UIContainer";
import BubbleShooterGamePlayModel from "./components/BubbleShooterGamePlayModel";
import { CannonContainer } from "./components/Cannon";
import { DynamicBubbleLayout } from "./components/bubbleLayout/DynamicBubbleLayout";
import { IWeaponBubbleImpactInfo } from "./components/bubbleLayout/GamePlayEngineModelInterfaces";
import { ObserverHandler } from "./components/bubbleLayout/ObserverHandler";
import { getDummyLayout } from "./components/bubbleLayout/StaticBubbleLayout";
import { BubbleFactoryController } from "./components/bubbleLayout/model/BubbleFactoryController";
import { BubbleType } from "./components/bubbleLayout/model/LayoutInterface";
import TileGridModel from "./components/bubbleLayout/model/TileGridModel";
import { getDiagonalLengthOfRectangle } from "./components/utils";
import { designResolution } from "./config";
import Background from "./components/Background";
import DeadLine from "./components/DeadLine";

export class GamePlayContainer extends Container {
    private app: Application;
    private cannon: CannonContainer;
    private bubbleLayoutLayer: DynamicBubbleLayout;
    private uiLayer: UIContainer;
    private deadLine: DeadLine;

    // constructor(app: Application) {
    //     this.app = app;
    //     this.container = new Container();
    //     this.app.stage.addChild(this.container);
    // }

    init(app: Application) {
        this.app = app;

        const layerSize = { width: this.app.screen.width, height: this.app.screen.height };
        this.velocityOfWeaponBubble = 2000 * (getDiagonalLengthOfRectangle(layerSize.width, layerSize.height) / designResolution.diagonal); //1000 is the velocity in design resolution.

        this.initBG();

        this.model = new BubbleShooterGamePlayModel();
        const tileGridModel = new TileGridModel();

        const bubbleFactoryController = new BubbleFactoryController();

        this.bubbleLayoutLayer = new DynamicBubbleLayout();
        this.cannon = new CannonContainer();

        this.dependencyProvider.init(this, this.bubbleLayoutLayer, this.cannon, this.model, layerSize,
            this.convertBubbleLayerToGameLayer.bind(this), this.convertGameLayerToBubbleLayer.bind(this), bubbleFactoryController);

        this.bubbleLayoutLayer.initLayout(this.app, getDummyLayout(), false, layerSize, tileGridModel, bubbleFactoryController, this._runtimeTempScoreUpdateObserver);
        this.cannon.init(this.app, this.dependencyProvider.getCannonDependency());
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
    }

    private initTouchListeners() {
        this.app.canvas.addEventListener('touchstart', (event: TouchEvent) => {
            this.onTouchStartReceived(new Point(event.touches[0].clientX, event.touches[0].clientY));
        });

        this.app.canvas.addEventListener('touchmove', (event: TouchEvent) => {
            this.onTouchMoveReceived(new Point(event.touches[0].clientX, event.touches[0].clientY));
        });

        this.app.canvas.addEventListener('touchend', (event: TouchEvent) => {
            this.onTouchEndReceived(new Point(event.changedTouches[0].clientX, event.changedTouches[0].clientY));
        });
    }

    private initDeadLine() {
        this.deadLine = new DeadLine(this.app);
        this.addChild(this.deadLine);
    }

    private initUILayer() {
        this.uiLayer = new UIContainer(this.app);
        this.addChild(this.uiLayer);
        this.uiLayer.zIndex = 300;
    }

    private initBG() {
        const background = new Background(this.app);
        this.addChild(background);
    }

    onTouchStartReceived(tp: Point) {
        if (this.isCannonActive()) {
            this.cannon.onTouchStart(tp);
        }
    }

    onTouchMoveReceived(tp: Point) {
        if (this.isCannonActive()) {
            this.cannon.onTouchMove(tp);
        }
    }

    async onTouchEndReceived(tp: Point): Promise<IWeaponBubbleImpactInfo> {
        if (!this.isCannonActive()) {
            return null;
        }

        const isCanonHavingValidRotation = this.cannon.onTouchEnd(tp);
        if (!isCanonHavingValidRotation) {
            return null;
        }

        const weaponBubbleContent = this.cannon.weaponBubble.content;
        this.cannon.onWeaponBubblePopFromCannon(this);

        const weaponBubbleImpactInfo: IWeaponBubbleImpactInfo = this.model.onWeaponBubbleFired(tp, this.cannon.weaponBubble, this.bubbleLayoutLayer.getTileGridModel().getClone());
        weaponBubbleImpactInfo.weaponBubbleContent = { type: BubbleType.ColorBubble, data: weaponBubbleContent };

        // this.currentStageState = EachRoundGamePlayStageStates.weaponBubbleIsMoving;

        console.error('weaponBubbleImpactInfo ', weaponBubbleImpactInfo)
        await this.cannon.weaponBubble.moveWeaponBubble(this.velocityOfWeaponBubble, weaponBubbleImpactInfo);
        await this.onWeaponBubbleMovementComplete(weaponBubbleImpactInfo);


        return weaponBubbleImpactInfo;
    }

    private isCannonActive() {
        return true;
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

        this.cannon.onWeaponBubbleActionComplete();

        if(this.bubbleLayoutLayer.getTileGridModel().isGridEmpty()){
            console.log("Game Won");
        }

        if (this.isGameOver()) {
            throw ('Game Over');
        }

        /**TESTING CODE START*/
        // const fallingBubbles = new FallingBubblesFinder().getFallingBubbles(this.bubbleLayoutLayer.tiles, this.bubbleLayoutLayer.layoutVisibilityController.getLastVisibleRowIndex());

        // if (fallingBubbles.bubbles.length > 0) {
        //     console.error(fallingBubbles);
        //     throw new Error("Falling bubbles found");
        // }
        /**TESTING CODE END*/

        // await this.bubbleLayoutLayer.layoutVisibilityController.switchRowIfNeeded();


        // this.currentStageState = EachRoundGamePlayStageStates.weaponBubbleIsReadyToFire;
    }

    private isGameOver() {
        return this.deadLine.isCrossed(this.bubbleLayoutLayer.getTileGridModel().getFirstFilledRowYPosition());
    }

    

    private velocityOfWeaponBubble = 1000;
    private model: BubbleShooterGamePlayModel = null;

    private _runtimeTempScoreUpdateObserver: ObserverHandler = new ObserverHandler();
    private dependencyProvider: StageGamePlayLayerDependencyProvider = new StageGamePlayLayerDependencyProvider();


}
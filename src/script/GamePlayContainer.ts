import { Application, Container, Point, Sprite } from "pixi.js";
import { CannonContainer } from "./components/Cannon";
import { getDummyLayout, StaticBubbleLayout } from "./components/bubbleLayout/StaticBubbleLayout";
import { BubbleFactoryController } from "./components/bubbleLayout/model/BubbleFactoryController";
import { BubbleUIFactory } from "./components/bubbleLayout/model/BubbleUIFactory";
import TileGridModel from "./components/bubbleLayout/model/TileGridModel";
import { DynamicBubbleLayout } from "./components/bubbleLayout/DynamicBubbleLayout";
import { IWeaponBubbleImpactInfo } from "./components/bubbleLayout/GamePlayEngineModelInterfaces";
import { BubbleType } from "./components/bubbleLayout/model/LayoutInterface";
import FallingBubblesFinder from "./components/utils/FallingBubblesFinder";
import StageGamePlayLayerDependencyProvider from "./StageGamePlayLayerDependencyProvider";
import BubbleShooterGamePlayModel from "./components/BubbleShooterGamePlayModel";
import { ObserverHandler } from "./components/bubbleLayout/ObserverHandler";
import { getDiagonalLengthOfRectangle } from "./components/utils";

export class GamePlayContainer extends Container {
    private app: Application;
    private cannon: CannonContainer;
    private bubbleLayoutLayer: DynamicBubbleLayout;

    // constructor(app: Application) {
    //     this.app = app;
    //     this.container = new Container();
    //     this.app.stage.addChild(this.container);
    // }

    init(app: Application) {
        this.app = app;

        const layerSize = { width: this.app.screen.width, height: this.app.screen.height };
        //  this.velocityOfWeaponBubble = 2000 * (getDiagonalLengthOfRectangle(layerSize.width, layerSize.height) / designResolution.diagonal); //1000 is the velocity in design resolution.

        this.velocityOfWeaponBubble = 500;

        this.model = new BubbleShooterGamePlayModel();
        const bubbleUIFactory = new BubbleUIFactory();
        const bubbleFactoryController = new BubbleFactoryController(bubbleUIFactory);

        const tileGridModel = new TileGridModel();

        this.bubbleLayoutLayer = new DynamicBubbleLayout();
        this.cannon = new CannonContainer();

        this.dependencyProvider.init(this, this.bubbleLayoutLayer, this.cannon, this.model, layerSize,
            this.convertBubbleLayerToGameLayer.bind(this), this.convertGameLayerToBubbleLayer.bind(this), bubbleFactoryController);


        this.bubbleLayoutLayer.initLayout(this.app, getDummyLayout(), false, { width: this.app.screen.width, height: this.app.screen.height }, 
        tileGridModel, bubbleFactoryController, this._runtimeTempScoreUpdateObserver);
        this.cannon.init(this.app, this.dependencyProvider.getCannonDependency());
        this.model.init(this.dependencyProvider.getGameModelDependency());

        this.cannon.initCannon();

        this.initBG();

        this.addChild(this.cannon);
        this.addChild(this.bubbleLayoutLayer);


        console.error('init ', this.bubbleLayoutLayer)

        this.app.canvas.addEventListener('touchstart', (event: TouchEvent) => {
            console.log('Touch start event detected:', event.touches[0].clientX, event.touches[0].clientY);
            this.onTouchStartReceived(new Point(event.touches[0].clientX, event.touches[0].clientY));
        });

        this.app.canvas.addEventListener('touchmove', (event: TouchEvent) => {
            console.log('Touch start event detected:', event.touches[0].clientX, event.touches[0].clientY);
            this.onTouchMoveReceived(new Point(event.touches[0].clientX, event.touches[0].clientY));
        });


        this.app.canvas.addEventListener('touchend', (event: TouchEvent) => {
            console.log('Touch end event detected:', event.changedTouches[0]);
            this.onTouchEndReceived(new Point(event.changedTouches[0].clientX, event.changedTouches[0].clientY));
        });

    }

    private initBG() {
        const background = Sprite.from('background');
        // Center background sprite anchor.
        background.anchor.set(0.5);
        background.addEventListener('touchstart', (event) => {
            console.log('Touch start event detected:', event);

            // Process event here
        });


        /**
         * If the preview is landscape, fill the width of the screen
         * and apply horizontal scale to the vertical scale for a uniform fit.
         */
        if (this.app.screen.width > this.app.screen.height) {
            background.width = this.app.screen.width * 1.2;
            background.scale.y = background.scale.x;
        }
        else {
            /**
             * If the preview is square or portrait, then fill the height of the screen instead
             * and apply the scaling to the horizontal scale accordingly.
             */
            background.height = this.app.screen.height * 1.2;
            background.scale.x = background.scale.y;
        }

        // Position the background sprite in the center of the stage.
        background.x = this.app.screen.width / 2;
        background.y = this.app.screen.height / 2;

        this.addChild(background);

        console.error('initBG ', background.position)
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

        this.cannon.onWeaponBubbleActionComplete();

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

    private velocityOfWeaponBubble = 1000;
    private model: BubbleShooterGamePlayModel = null;

    private _runtimeTempScoreUpdateObserver: ObserverHandler = new ObserverHandler();
    private dependencyProvider: StageGamePlayLayerDependencyProvider = new StageGamePlayLayerDependencyProvider();

}
import { Application, Container, Point, Sprite } from "pixi.js";
import { CannonContainer } from "./components/Cannon";
import { getDummyLayout, StaticBubbleLayout } from "./components/bubbleLayout/StaticBubbleLayout";
import { BubbleFactoryController } from "./components/bubbleLayout/model/BubbleFactoryController";
import { BubbleUIFactory } from "./components/bubbleLayout/model/BubbleUIFactory";
import TileGridModel from "./components/bubbleLayout/model/TileGridModel";

export class GamePlayContainer {
    private app: Application;
    private container: Container;

    constructor(app: Application) {
        this.app = app;
        this.container = new Container();
        this.app.stage.addChild(this.container);
    }

    init() {
        this.initBG();

        const cannonContainer = new CannonContainer(this.app, this.container);

        const bubbleLayout = new StaticBubbleLayout(this.app);

        const bubbleUIFactory = new BubbleUIFactory();
        const bubbleFactoryController = new BubbleFactoryController(bubbleUIFactory);

        const tileGridModel = new TileGridModel();

        bubbleLayout.init(getDummyLayout(), false, { width: this.app.screen.width, height: this.app.screen.height }, tileGridModel, bubbleFactoryController);

        console.error('init ', bubbleLayout)

        this.app.canvas.addEventListener('touchstart', (event: TouchEvent) => {
            console.log('Touch start event detected:', event.touches[0].clientX, event.touches[0].clientY);
            cannonContainer.onTouchStart(new Point(event.touches[0].clientX, event.touches[0].clientY));
        });

        this.app.canvas.addEventListener('touchmove', (event: TouchEvent) => {
            console.log('Touch start event detected:', event.touches[0].clientX, event.touches[0].clientY);
            cannonContainer.onTouchStart(new Point(event.touches[0].clientX, event.touches[0].clientY));
        });


        this.app.canvas.addEventListener('touchend', (event: TouchEvent) => {
            console.log('Touch end event detected:', event.changedTouches[0]);
            cannonContainer.onTouchStart(new Point(event.changedTouches[0].clientX,event.changedTouches[0].clientY));
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

        this.container.addChild(background);

        console.error('initBG ', background.position)
    }
}
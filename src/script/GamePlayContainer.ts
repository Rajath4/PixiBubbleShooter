import { Application, Container, Sprite } from "pixi.js";

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
    }

    private initBG() {
        const background = Sprite.from('background');
        // Center background sprite anchor.
        background.anchor.set(0.5);

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
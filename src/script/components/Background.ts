import { Sprite, Application, Texture } from 'pixi.js';

class Background extends Sprite {
    private app: Application;

    constructor(app: Application) {
        super();
        this.app = app;
        this.texture = Texture.from('background'); // Ensure the texture is set
        this.initBG();
    }

    private initBG() {
        // Center background sprite anchor.
        this.anchor.set(0.5);

        /**
         * If the preview is landscape, fill the width of the screen
         * and apply horizontal scale to the vertical scale for a uniform fit.
         */
        if (this.app.screen.width > this.app.screen.height) {
            this.width = this.app.screen.width * 1.2;
            this.scale.y = this.scale.x;
        } else {
            /**
             * If the preview is square or portrait, then fill the height of the screen instead
             * and apply the scaling to the horizontal scale accordingly.
             */
            this.height = this.app.screen.height * 1.2;
            this.scale.x = this.scale.y;
        }

        // Position the background sprite in the center of the stage.
        this.x = this.app.screen.width / 2;
        this.y = this.app.screen.height / 2;
    }
}

export default Background;

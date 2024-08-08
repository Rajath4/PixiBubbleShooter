import { Size, Sprite, Texture } from 'pixi.js';

class Background extends Sprite {
    private layerSize: Size;

    constructor(layerSize: Size) {
        super();
        this.layerSize = layerSize;
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
        if ( this.layerSize.width >  this.layerSize.height) {
            this.width =  this.layerSize.width * 1.2;
            this.scale.y = this.scale.x;
        } else {
            /**
             * If the preview is square or portrait, then fill the height of the screen instead
             * and apply the scaling to the horizontal scale accordingly.
             */
            this.height =  this.layerSize.height * 1.2;
            this.scale.x = this.scale.y;
        }

        // Position the background sprite in the center of the stage.
        this.x =  this.layerSize.width / 2;
        this.y =  this.layerSize.height / 2;
    }
}

export default Background;

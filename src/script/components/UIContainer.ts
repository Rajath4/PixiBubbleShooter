import { Container, Size, Sprite } from "pixi.js";
import ScorePanel from "./ui/ScorePanel";

export class UIContainer extends Container {
    private layerSize: Size;
    private scorePanel: ScorePanel;
    private topHeader: Sprite;

    constructor(layerSize: Size) {
        super();
        this.layerSize = layerSize; 

        this.initHeader();
        this.initScorePanel();
    }


    initHeader() {
        this.topHeader = Sprite.from('top_header');
        this.topHeader.anchor.set(0.5, 0.5);
        //scale the header to fit the screen width
        const scaleFactor =  this.layerSize.width / this.topHeader.width;
        this.topHeader.scale.set(scaleFactor);
        this.topHeader.position.set( this.layerSize.width * 0.5, this.topHeader.height * 0.5);
        this.addChild(this.topHeader);
    }

    getTopHeaderHeight() {
        return this.topHeader.height;
    }

    initScorePanel() {
        this.scorePanel = new ScorePanel(this.layerSize);
        this.addChild(this.scorePanel);
    }

    setScore(score: number) {
        this.scorePanel.setScore(score);
    }

}
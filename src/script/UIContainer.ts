import { Application, Container, Sprite } from "pixi.js";
import ScorePanel from "./components/ui/ScorePanel";

export class UIContainer extends Container {
    private app: Application;
    private scorePanel: ScorePanel;
    private topHeader: Sprite;

    constructor(app: Application) {
        super();
        this.app = app;

        this.initHeader();
        this.initScorePanel();
    }


    initHeader() {
        this.topHeader = Sprite.from('top_header');
        this.topHeader.anchor.set(0.5, 0.5);
        //scale the header to fit the screen width
        const scaleFactor = this.app.screen.width / this.topHeader.width;
        this.topHeader.scale.set(scaleFactor);
        this.topHeader.position.set(this.app.screen.width * 0.5, this.topHeader.height * 0.5);
        this.addChild(this.topHeader);
    }

    getTopHeaderHeight() {
        return this.topHeader.height;
    }

    initScorePanel() {
        this.scorePanel = new ScorePanel(this.app);
        this.addChild(this.scorePanel);
    }

    setScore(score: number) {
        this.scorePanel.setScore(score);
    }

}
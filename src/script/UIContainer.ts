import { Application, Container, Sprite } from "pixi.js";
import ScorePanel from "./components/ui/ScorePanel";

export class UIContainer extends Container {
    private app: Application;
    private scorePanel: ScorePanel;
    constructor(app: Application) {
        super();
        this.app = app;

        this.initHeader();
        this.initScorePanel();
    }


    initHeader() {
        const topHeader = Sprite.from('top_header');
        topHeader.anchor.set(0.5, 0.5);
        topHeader.position.set(this.app.screen.width * 0.5, topHeader.height * 0.5);
        topHeader.width = this.app.screen.width;
        topHeader.alpha = 0.975;
        this.addChild(topHeader);
    }

    initScorePanel() {
        this.scorePanel = new ScorePanel(this.app);
        this.addChild(this.scorePanel);
    }

    setScore(score: number) {
        this.scorePanel.setScore(score);
    }
    
}
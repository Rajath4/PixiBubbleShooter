import { Application, Container, Sprite, Text } from 'pixi.js';

class ScorePanel extends Container {
    private app: Application;
    private scoreText: Text;
    private scorePanel: Sprite;

    constructor(app: Application) {
        super();
        this.app = app;
        this.initScorePanel();
        this.initScoreText();
    }

    private initScorePanel() {
        this.scorePanel = Sprite.from('score_panel');
        this.scorePanel.anchor.set(0.5, 0.5);
        this.scorePanel.position.set(this.app.screen.width * 0.5, this.scorePanel.height * 0.5);
        this.addChild(this.scorePanel);
    }

    private initScoreText() {
        this.scoreText = new Text({
            text: '0',
            style: {
                fontFamily: 'Arial',
                fontSize: 32,
                fill: 0xffffff,
                align: 'center',
                fontWeight: 'bold'
            }
        })
        this.scoreText.anchor.set(0.5, 0.5);
        this.scoreText.position.set(this.app.screen.width * 0.475,  this.scorePanel.height * 0.5);  // Adjust the Y position as needed
        this.addChild(this.scoreText);
    }

    public setScore(score: number) {
        this.scoreText.text = score.toString();
    }
}

export default ScorePanel;

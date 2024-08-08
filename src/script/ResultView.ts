import { Application, Color, Container, Text, Texture } from "pixi.js";
import Background from "./components/Background";
import { TextButton } from "./generic/components/TextButton";

export class ResultView extends Container {
    private app: Application;


    init(app: Application, isWon: boolean, sessionScore: number) {
        this.app = app;

        this.initBG();
        this.initPlayAgainButton();

        isWon ? this.initWonText() : this.intiLostText();
        this.initScoreInfo(sessionScore);
        this.initPlayAgainDescription(isWon);
    }

    private initBG() {
        const background = new Background(this.app);
        background.tint = new Color(0xB6B6B4);
        this.addChild(background);
    }

    private initPlayAgainButton() {
        const playAgainButton = new TextButton(Texture.from('play_again_button'), 'Play Again', 64, 0xfff8e1);
        playAgainButton.onClick(() => {
            console.log('Play again button clicked');
        });
        playAgainButton.setPosition(this.app.screen.width * 0.5, this.app.screen.height * 0.75);
        this.addChild(playAgainButton);
    }

    initWonText() {
        const wonText = new Text({
            text: "You Won!!", style: {
                fontFamily: 'Arial',
                fontSize: 48,
                fill: 0x6200ea,
                align: 'center',
                fontWeight: 'bold'
            }
        });
        wonText.anchor.set(0.5);
        wonText.position.set(this.app.screen.width * 0.5, this.app.screen.height * 0.25);
        this.addChild(wonText);
    }

    intiLostText() {
        const lostText = new Text({
            text: "You Lost!!", style: {
                fontFamily: 'Arial',
                fontSize: 48,
                fill: 0xd84315,
                align: 'center',
                fontWeight: 'bold'
            }
        });
        lostText.anchor.set(0.5);
        lostText.position.set(this.app.screen.width * 0.5, this.app.screen.height * 0.25);
        this.addChild(lostText);
    }

    initScoreInfo(score: number) {
        const scoreInfo = new Text({
            text: `Your Score: ${score}`, style: {
                fontFamily: 'Arial',
                fontSize: 24,
                fill: 0xeeeeee,
                align: 'center',
                fontWeight: 'bold'
            }
        });
        scoreInfo.anchor.set(0.5);
        scoreInfo.position.set(this.app.screen.width * 0.5, this.app.screen.height * 0.5);
        this.addChild(scoreInfo);
    }

    initPlayAgainDescription(isWon: boolean) {
        const playAgainDescription = new Text({
            text: isWon ? 'You can play again to improve your score' : 'You can play again to win', style: {
                fontFamily: 'Arial',
                fontSize: 14,
                fill: 0x9e9e9e,
                align: 'center',
                fontWeight: 'bold'
            }
        });
        playAgainDescription.anchor.set(0.5);
        playAgainDescription.position.set(this.app.screen.width * 0.5, this.app.screen.height * 0.65);
        this.addChild(playAgainDescription);
    }

}